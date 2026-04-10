const utilisateurRepo = require('../repositories/utilisateurRepositories');
const formateurRepo = require('../repositories/formateurRepositories');
const coursRepo = require('../repositories/coursRepositories');
const journalRepo = require('../repositories/journalActiviteRepositories');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); // Ajout de bcrypt pour la sécurité
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AdminController {

    // --- AUTHENTIFICATION (JSON) ---
    async loginAction(req, res) {
        const { email, password } = req.body;
        console.log(email, password)
        try {
            const user = await utilisateurRepo.findByEmail(email);

            // Vérification sécurisée avec compatibilité PHP ($2y$ -> $2a$)
            if (user && user.role === 'admin') {
                const dbHash = user.mot_de_passe.replace(/^\$2y\$/, "$2a$");
                const match = await bcrypt.compare(password, dbHash);

                if (match) {
                    const token = jwt.sign(
                        {
                            id: user.id,
                            role: user.role,
                            email: user.email
                        }, process.env.JWT_SECRET,
                        { expiresIn: "24h"}
                    )
                    return res.json({
                        success: true,
                        message: "Authentification admin réussie",
                        redirect: '/admin/backoffice' ,// On donne l'indice au front
                        token: token
                    });
                }
            }

            return res.status(401).json({ success: false, message: "Identifiants incorrects ou accès refusé." });
        } catch (error) {
            res.status(500).json({ success: false, message: "Erreur serveur lors de la connexion." });
        }
    }

    // --- TABLEAU DE BORD (JSON) ---
    async backoffice(req, res) {
        try {
            const stats = {
                newApprenant: await utilisateurRepo.getNewApprenantCount(),
                newFormateur: await formateurRepo.getNewFormateursCount(),
                newCours: await coursRepo.getNewCoursCount(),
                inactiveUsers: await utilisateurRepo.getInactiveUsers(),
                apprenantCount: await utilisateurRepo.countApprenant(),
                formateursCount: await formateurRepo.countFormateur(),
                coursCount: await coursRepo.countCours(),
                activiteLog: await journalRepo.countLog(),
                lastLog: await journalRepo.getLastLogs()
            };

            const inscriptions = {};
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const mois = date.toISOString().slice(0, 7);
                inscriptions[mois] = await utilisateurRepo.countApprenantsByMonth(mois);
            }

            res.json({ success: true, stats, inscriptions });
        } catch (error) {
            res.status(500).json({ success: false, message: "Erreur lors de la récupération des stats.\nerror : " + error });
        }
    }

    // --- GESTION UTILISATEURS (JSON) ---
    async gestionUser(req, res) {
        const { search, sort = 'id', order = 'asc' } = req.query;

        try {

            const users = await utilisateurRepo.getFilteredUsers(search, ['apprenant'], sort, order);
            const formateurs = await formateurRepo.getFilteredFormateurs(search, sort, order);
            const admins = await utilisateurRepo.getFilteredUsers(search, ['admin', 'moderator'], sort, order);

            res.json({ success: true, data: { users, formateurs, admins }, filters: { search, sort, order } });
        } catch (error) {
            res.status(500).json({ success: false, message: "Erreur de filtrage.\nerror: " + error });
        }
    }

    // --- EXPORT CSV (Garde le flux fichier) ---
    async exportCsv(req, res) {
        try {
            const users = await utilisateurRepo.getFilteredUsers(null, ['apprenant']);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=utilisateurs.csv');

            let csvContent = "Type,ID,Nom,Email,Statut\n";
            users.forEach(u => {
                csvContent += `Apprenant,${u.id},${u.nom},${u.email},${u.actif ? 'Actif' : 'Inactif'}\n`;
            });
            res.send(csvContent);
        } catch (error) {
            res.status(500).json({ success: false, message: "Erreur d'exportation." });
        }
    }

    // --- ENVOI DE CODE (JSON) ---
    async sendCode(req, res) {
        const { id } = req.body;
        try {
            const code = Math.random().toString(36).substring(2, 10).toUpperCase();
            const formateur = await formateurRepo.getById(id);

            if (!formateur) return res.status(404).json({ success: false, message: "Formateur non trouvé." });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: 'votre@email.com', pass: 'votre_password_app' }
            });

            await transporter.sendMail({
                from: 'Yitro Learning <no-reply@yitro.com>',
                to: formateur.email,
                subject: 'Votre code d\'inscription',
                html: `<h2>Votre code : ${code}</h2>`
            });

            await formateurRepo.updateCode(id, code);
            await journalRepo.insert(req.session.user_id, 'Envoi code', `Code ${code} envoyé à ${formateur.email}`);

            res.json({ success: true, message: `Code envoyé avec succès à ${formateur.email}` });
        } catch (error) {
            res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email." });
        }
    }

    // --- GÉNÉRATION DE CERTIFICAT (Fichier + JSON Info) ---
    async generateCertificate(req, res) {
        const { apprenant_id, cours_id } = req.body;
        try {
            const info = await utilisateurRepo.getInfoCertificat(apprenant_id, cours_id);
            if (!info) return res.status(403).json({ success: false, message: "Éligibilité non vérifiée." });

            const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
            const filename = `certificat_${apprenant_id}_${cours_id}.pdf`;
            const uploadDir = path.join(__dirname, '../../uploads/certificats/');

            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const filePath = path.join(uploadDir, filename);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#01AE8F');
            doc.fontSize(30).fillColor('#01AE8F').text('CERTIFICAT DE RÉUSSITE', { align: 'center' }, 100);
            doc.fontSize(25).fillColor('black').text(info.nom, { align: 'center' }, 200);
            doc.end();

            stream.on('finish', () => {
                // Retourne du JSON avec le lien vers le fichier généré
                res.json({
                    success: true,
                    message: "Certificat généré avec succès",
                    downloadUrl: `/uploads/certificats/${filename}`
                });
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Erreur lors de la génération du PDF.\nerror: " + error });
        }
    }
}

module.exports = new AdminController();
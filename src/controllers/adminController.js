const utilisateurRepo = require('../repositories/utilisateurRepositories');
const formateurRepo = require('../repositories/formateurRepositories');
const coursRepo = require('../repositories/coursRepositories');
const journalRepo = require('../repositories/journalActiviteRepositories');
const inscriptionRepo = require('../repositories/inscriptionRepositories');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class AdminController {

    // --- AUTHENTIFICATION ---

    async loginPage(req, res) {
        res.render('admin/login', { error: req.session.error });
        delete req.session.error;
    }

    async loginAction(req, res) {
        const { email, mot_de_passe } = req.body;
        const user = await utilisateurRepo.findByEmail(email);

        // Simulation de password_verify (à remplacer par bcrypt.compare)
        if (user && user.role === 'admin' && user.mot_de_passe === mot_de_passe) {
            req.session.user_id = user.id;
            req.session.user_role = user.role;
            return res.redirect('/admin/backoffice');
        }
        
        req.session.error = "Identifiants incorrects ou accès refusé.";
        res.redirect('/admin/login');
    }

    // --- TABLEAU DE BORD ---

    async backoffice(req, res) {
        const stats = {
            newApprenant: await utilisateurRepo.getNewApprenantCount(),
            newFormateur: await formateurRepo.getNewFormateurCount(),
            newCours: await coursRepo.getNewCoursCount(),
            inactiveUsers: await utilisateurRepo.getInactiveUsers(),
            apprenantCount: await utilisateurRepo.countApprenant(),
            formateursCount: await formateurRepo.countFormateur(),
            coursCount: await coursRepo.countCours(),
            activiteLog: await journalRepo.countLog(),
            lastLog: await journalRepo.getLastLog()
        };

        // Calcul des inscriptions sur les 6 derniers mois
        const inscriptions = {};
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const mois = date.toISOString().slice(0, 7); // Format YYYY-MM
            inscriptions[mois] = await utilisateurRepo.countApprenantsByMonth(mois);
        }

        res.render('admin/backoffice', { ...stats, inscriptions });
    }

    // --- GESTION UTILISATEURS & EXPORT ---

    async gestionUser(req, res) {
        const { search, sort = 'id', order = 'asc' } = req.query;
        
        const users = await utilisateurRepo.getFilteredUsers(search, ['apprenant'], sort, order);
        const formateurs = await formateurRepo.getFilteredFormateurs(search, sort, order);
        const admins = await utilisateurRepo.getFilteredUsers(search, ['admin', 'moderator'], sort, order);

        res.render('admin/gestionutilisateur', { users, formateurs, admins, search, sort, order });
    }

    async exportCsv(req, res) {
        const users = await utilisateurRepo.getFilteredUsers(null, ['apprenant']);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=utilisateurs.csv');

        let csvContent = "Type,ID,Nom,Email,Statut\n";
        users.forEach(u => {
            csvContent += `Apprenant,${u.id},${u.nom},${u.email},${u.actif ? 'Actif' : 'Inactif'}\n`;
        });
        
        res.send(csvContent);
    }

    // --- ENVOI DE CODE (MAILER) ---

    async sendCode(req, res) {
        const { id } = req.body;
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const formateur = await formateurRepo.getById(id);

        if (!formateur) return res.redirect('/admin/gestionuser');

        // Configuration Nodemailer (équivalent PHPMailer)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: 'votre@email.com', pass: 'votre_password_app' }
        });

        const mailOptions = {
            from: 'Yitro Learning <no-reply@yitro.com>',
            to: formateur.email,
            subject: 'Votre code d\'inscription',
            html: `<h2>Votre code : ${code}</h2>`
        };

        try {
            await transporter.sendMail(mailOptions);
            await formateurRepo.updateCode(id, code);
            await journalRepo.insert(req.session.user_id, 'Envoi code', `Code ${code} envoyé à ${formateur.email}`);
            res.redirect('/admin/gestionuser');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de l'envoi de l'email");
        }
    }

    // --- GÉNÉRATION DE CERTIFICAT (PDF) ---

    async generateCertificate(req, res) {
        const { apprenant_id, cours_id } = req.body;
        const info = await utilisateurRepo.getInfoCertificat(apprenant_id, cours_id);

        if (!info) return res.send("Éligibilité non vérifiée.");

        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        const filename = `certificat_${apprenant_id}_${cours_id}.pdf`;
        const filePath = path.join(__dirname, '../../uploads/certificats/', filename);

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Design du certificat
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#01AE8F');
        doc.fontSize(30).fillColor('#01AE8F').text('CERTIFICAT DE RÉUSSITE', { align: 'center' }, 100);
        doc.fontSize(16).fillColor('black').text('Décerné à', { align: 'center' }, 160);
        doc.fontSize(25).text(info.nom, { align: 'center' }, 200);
        doc.fontSize(16).text(`Pour avoir complété le cours : ${info.Cours.titre}`, { align: 'center' }, 260);

        doc.end();

        stream.on('finish', () => {
            res.render('admin/espacecertificat', { message: "Certificat généré", link: `/uploads/certificats/${filename}` });
        });
    }
}

module.exports = new AdminController();
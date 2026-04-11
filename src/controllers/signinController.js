const userRepo = require('../repositories/utilisateurRepositories');
const formateurRepo = require('../repositories/formateurRepositories');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');


class SigninController {

    // --- FLUX APPRENANT ---
    async signupApprenant(req, res) {
        const { nom, email, password, pays, langue, type_cours, niveau_formation } = req.body;

        // Validation Node.js
        if (!nom || !email || !password || !pays || !langue || !type_cours || !niveau_formation) {
            return res.status(400).send("Tous les champs obligatoires doivent être remplis.");
        }

        try {
            // Vérifier si l'email existe
            const userExists = await userRepo.getByEmail(email);
            if (userExists) return res.status(400).send("Cet e-mail est déjà utilisé.");

            // Hachage du mot de passe (Node utilise bcrypt)
            const hashedPassword = await bcrypt.hash(password, 10);

            // Gestion de la photo (Multer)
            let photoPath = "";
            if (req.file) {
                photoPath = `Uploads/${Date.now()}_${req.file.originalname}`;
                fs.writeFileSync(path.join(__dirname, '../../', photoPath), req.file.buffer);
            }

            // Objectifs (implode PHP -> join JS)
            const objectifs = req.body.objectifs ? req.body.objectifs.join(", ") : "";

            await userRepo.insert({
                ...req.body,
                mot_de_passe: hashedPassword,
                photo: photoPath,
                objectifs: objectifs,
                role: "apprenant",
                rgpd: req.body.rgpd ? 1 : 0,
                charte: req.body.charte ? 1 : 0
            });

            res.json({
                message: "apprenant created"
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de l'inscription."+error);
        }
    }

    // --- FLUX FINALISATION FORMATEUR ---
    async confirmFormateur(req, res) {
        const { nom_prenom, email, password, confirm_password, entryCode } = req.body;
        const cleanCode = entryCode;

        if (password !== confirm_password) return res.status(400).send("Mots de passe différents.");

        try {
            // Vérifier le code d'entrée
            const checkCode = await formateurRepo.checkCode(email, cleanCode);
            if (!checkCode || checkCode.length === 0) {
                return res.status(400).send("Code d'entrée invalide.");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Mise à jour et reset du code (Logique RESET_CODE_STMT)
            const success = await formateurRepo.resetCodeAndActivate(email,nom_prenom, hashedPassword);
            
            if (success) {
                req.session.inscription_formateur_ok = "Inscription réussie.";
                res.json({
                    success: true,
                    message: "Confirmation ok"
                });
            } else {
                res.json({
                    message: "check your access code in your mail"
                });
            }
        } catch (error) {
            res.status(500).send("Erreur serveur."+error);
        }
    }

    // --- FLUX CANDIDATURE (POSTULER) ---
    async postulerFormateur(req, res) {
        try {
            let cvNom = "";
            if (req.file) {
                cvNom = `${Date.now()}_${req.file.originalname}`;
                fs.writeFileSync(path.join('./Uploads/cv/', cvNom), req.file.buffer);
            }

            // Mapping des données (implode pour les tableaux)
            const categories = Array.isArray(req.body.categories) ? req.body.categories.join(", ") : "";
            const formats = Array.isArray(req.body.formats) ? req.body.formats.join(", ") : "";
            const valeurs = Array.isArray(req.body.valeurs) ? req.body.valeurs.join(", ") : "";

            await formateurRepo.insert({
                ...req.body,
                cv_nom: cvNom,
                categories,
                formats,
                valeurs,
                statut: "en_attente"
            });

            res.json({
                "message": "candidature sent"
            });
        } catch (error) {
            res.status(500).send("Erreur lors de la candidature."+error);
        }
    }
}

module.exports = new SigninController();
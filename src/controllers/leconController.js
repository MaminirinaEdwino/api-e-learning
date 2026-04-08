const path = require('path');
const fs = require('fs');
const leconRepo = require('../repositories/leconRepositories');

class LeconController {

    // --- AFFICHAGE DU FORMULAIRE D'ÉDITION ---
    async renderEdit(req, res) {
        const { id } = req.params;
        try {
            const lecon = await leconRepo.getById(id);
            res.render('lecon/lecon', {
                leconId: id,
                lecon: lecon
            });
        } catch (error) {
            res.status(404).send("Leçon introuvable.");
        }
    }

    // --- TRAITEMENT DE LA MODIFICATION (POST) ---
    async updateLecon(req, res) {
        const { id } = req.params;
        const { titre, format } = req.body;
        const uploadDir = './Uploads/lecons/';

        try {
            const lecon = await leconRepo.getById(id);
            let currentFichier = lecon.fichier;

            // Vérification si un nouveau fichier a été téléchargé
            if (req.file) {
                const allowedExtensions = {
                    pdf: ['.pdf'],
                    audio: ['.mp3', '.wav'],
                    video: ['.mp4', '.avi']
                };

                const fileExt = path.extname(req.file.originalname).toLowerCase();

                // Validation de l'extension par rapport au format
                if (!allowedExtensions[format].includes(fileExt)) {
                    return res.status(400).send(`Le fichier doit être au format ${allowedExtensions[format].join(', ')} pour le format ${format}.`);
                }

                // Génération du nouveau nom de fichier unique
                const newFileName = `lecon_${Date.now()}${fileExt}`;
                const destination = path.join(uploadDir, newFileName);

                // Écriture du nouveau fichier
                fs.writeFileSync(destination, req.file.buffer);

                // Suppression de l'ancien fichier s'il existe
                if (currentFichier) {
                    const oldPath = path.join(uploadDir, currentFichier);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
                currentFichier = newFileName;
            }

            // Mise à jour en base de données
            await leconRepo.update(id, {
                titre: titre.trim(),
                format: format,
                fichier: currentFichier
            });

            res.redirect('/cours/formateur');

        } catch (error) {
            console.error("Erreur mise à jour leçon:", error);
            res.status(500).send("Erreur lors de la mise à jour : " + error.message);
        }
    }

    // --- SUPPRESSION ---
    async deleteLecon(req, res) {
        const { id } = req.params;
        try {
            const lecon = await leconRepo.getById(id);
            
            // Suppression du fichier physique
            if (lecon && lecon.fichier) {
                const filePath = path.join('./Uploads/lecons/', lecon.fichier);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await leconRepo.delete(id);
            res.redirect('/cours/formateur');
        } catch (error) {
            res.status(500).send("Erreur lors de la suppression.");
        }
    }
}

module.exports = new LeconController();
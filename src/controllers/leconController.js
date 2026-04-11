const path = require('path');
const fs = require('fs');
const leconRepo = require('../repositories/leconRepositories');
const { Lecon, Module } = require('../models');
class LeconController {

    // --- AFFICHAGE DU FORMULAIRE D'ÉDITION ---
    async create(req, res) {
        try {
            const { module_id, titre, format } = req.body;
            // 1. Validation simple des champs obligatoires
            if (!module_id || !titre) {
                return res.status(400).json({
                    message: "Le module_id et le titre sont obligatoires."
                });
            }

            // 2. Vérification optionnelle : le module parent existe-t-il ?
            // Très utile pour éviter les erreurs de clé étrangère sur MariaDB
            if (Module) {
                const moduleExists = await Module.findByPk(module_id);
                if (!moduleExists) {
                    return res.status(404).json({
                        message: "Le module spécifié n'existe pas."
                    });
                }
            }

            if (!req.file) {
                return res.status(400).json({ message: "Veuillez uploader un fichier." });
            }

            const nouvelleLecon = await Lecon.create({
                module_id,
                titre,
                format,
                // On enregistre le chemin relatif ou le nom du fichier
                fichier: req.file.filename 
            });

            res.status(201).json({
                message: "Leçon créée avec succès !",
                lecon: nouvelleLecon
            });

        } catch (error) {
            console.error("Erreur lors de l'insertion de la leçon :", error);

            // Gestion spécifique des erreurs Sequelize (ex: contrainte de clé étrangère)
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    message: "Erreur de cohérence : le module_id est invalide."
                });
            }

            return res.status(500).json({
                message: "Une erreur interne est survenue lors de la création."
            });
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

            res.json({
                id: id,
                titre: titre.trim(),
                format: format,
                fichier: currentFichier
            });

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
            res.json({
                id: id,
                message: "lecon deleted"
            });
        } catch (error) {
            res.status(500).send("Erreur lors de la suppression.");
        }
    }

    async getAll(req, res) {
        let lecon = await leconRepo.getAll();
        res.json({
            lecon: lecon
        })
    }
}

module.exports = new LeconController();
const path = require('path');
const fs = require('fs');
const coursRepo = require('../repositories/coursRepository');
const moduleRepo = require('../repositories/moduleRepository');
const leconRepo = require('../repositories/leconRepository');
const formationRepo = require('../repositories/formationRepository');

class CoursController {

    // --- CRÉATION DE COURS (POST) ---
    async createCours(req, res) {
        const formateurId = req.session.formateur_id;
        const uploadDir = './Uploads/cours/';
        const leconUploadDir = './Uploads/lecons/';

        try {
            const { formation_id, contenu_formation_id, titre_cours, description_cours, prix_cours, niveau_cours, modules } = req.body;

            // 1. Gestion de la photo du cours
            let photoFilename = null;
            if (req.files && req.files['photo_cours']) {
                const photo = req.files['photo_cours'][0];
                photoFilename = `course_${Date.now()}${path.extname(photo.originalname)}`;
                fs.writeFileSync(path.join(uploadDir, photoFilename), photo.buffer);
            }

            // 2. Insertion du Cours
            const newCours = await coursRepo.insert({
                formateur_id: formateurId,
                formation_id,
                contenu_formation_id,
                titre: titre_cours,
                description: description_cours,
                prix: prix_cours,
                photo: photoFilename,
                niveau: niveau_cours
            });

            const coursId = newCours.id;

            // 3. Gestion des Modules et Leçons (Boucle synchrone pour préserver l'ordre)
            if (modules && Array.isArray(modules)) {
                for (let i = 0; i < modules.length; i++) {
                    const mod = modules[i];
                    
                    const createdModule = await moduleRepo.insert({
                        cours_id: coursId,
                        titre: mod.titre,
                        description: mod.description
                    });

                    // Gestion des leçons associées à ce module
                    if (mod.lecons && Array.isArray(mod.lecons)) {
                        for (let j = 0; j < mod.lecons.length; j++) {
                            const lec = mod.lecons[j];
                            
                            // Récupération du fichier correspondant dans req.files
                            // Note: Multer aplatit souvent les noms de fichiers complexes
                            const fileKey = `modules[${i}][lecons][${j}][fichier]`;
                            const file = req.files[fileKey] ? req.files[fileKey][0] : null;

                            if (file) {
                                const leconExt = path.extname(file.originalname);
                                const leconFilename = `lecon_${coursId}_${createdModule.id}_${Date.now()}_${j}${leconExt}`;
                                fs.writeFileSync(path.join(leconUploadDir, leconFilename), file.buffer);

                                await leconRepo.insert({
                                    module_id: createdModule.id,
                                    titre: lec.titre,
                                    format: lec.format,
                                    fichier: leconFilename
                                });
                            }
                        }
                    }
                }
            }

            res.redirect('/cours/formateur');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de la création du cours : " + error.message);
        }
    }

    // --- LISTE POUR LE FORMATEUR ---
    async listForFormateur(req, res) {
        const formateurId = req.session.formateur_id;
        const cours = await coursRepo.getCoursFormationContenu(formateurId);
        
        // On enrichit les données avec les modules et leçons
        for (let c of cours) {
            c.modules = await moduleRepo.getByCoursId(c.id);
            for (let m of c.modules) {
                m.lecons = await leconRepo.getByModuleId(m.id);
            }
        }

        res.render('cours/list', { cours });
    }

    // --- SUPPRESSION ---
    async deleteCours(req, res) {
        const { id } = req.params;
        try {
            const cours = await coursRepo.getById(id);
            if (cours && cours.photo) {
                const photoPath = path.join('./Uploads/cours/', cours.photo);
                if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
            }

            // Sequelize gère généralement les DELETE CASCADE si configuré, 
            // sinon il faut appeler les repos manuellement comme dans votre PHP.
            await coursRepo.delete(id);
            res.redirect('/cours/formateur');
        } catch (error) {
            res.status(500).send("Erreur suppression");
        }
    }
}

module.exports = new CoursController();
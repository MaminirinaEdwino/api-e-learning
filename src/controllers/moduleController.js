const moduleRepo = require('../repositories/moduleRepositories');
const completionRepo = require('../repositories/completionRepositories');
const leconRepo = require('../repositories/leconRepositories');

class ModuleController {

    async getAll(req, res) {
        let modules = await moduleRepo.getAll()
        res.json({
            modules
        })
    }

    async create(req, res) {
        const { cours_id, titre, description } = req.body

        try {
            await moduleRepo.insert({
                cours_id: cours_id,
                titre: titre,
                description: description
            })
            res.json({
                message: "module created"
            })
        } catch (error) {
            res.status(500).send("Erreur lors de la creation du module." + error);
        }
    }

    // --- ÉDITION (POST) ---
    async updateModule(req, res) {
        const { id } = req.params;
        const { titre, description } = req.body;

        try {
            await moduleRepo.update(id, { titre, description });
            res.json({
                id: id,
                titre: titre,
                description: description
            });
        } catch (error) {
            res.status(500).send("Erreur lors de la mise à jour.");
        }
    }

    // --- SUPPRESSION ---
    async deleteModule(req, res) {
        const { id } = req.params;
        try {
            // Suppression en cascade manuelle (comme dans votre PHP)
            await completionRepo.deleteByModuleId(id);
            await leconRepo.deleteByModuleId(id);
            await moduleRepo.delete(id);

            res.json({
                message: "module deleted"
            });
        } catch (error) {
            res.status(500).send("Erreur lors de la suppression.");
        }
    }

    // --- API : RÉCUPÉRER LES MODULES D'UN COURS (JSON) ---
    async getModulesByCours(req, res) {
        try {
            const modules = await moduleRepo.getByCoursIdArray(req.params.id);
            res.json(modules);
        } catch (error) {
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // --- API : MARQUER COMME TERMINÉ (POST JSON) ---
    async toggleCompletion(req, res) {
        const { module_id, cours_id, is_checked } = req.body;
        const utilisateur_id = req.user.id;

        if (!module_id || !cours_id || is_checked === undefined) {
            return res.status(400).json({ success: false, message: 'Données manquantes' });
        }

        try {
            const module = await moduleRepo.getByIdCoursId(module_id, cours_id);
            if (!module) {
                return res.status(400).json({ success: false, message: 'Module ou cours invalide' });
            }

            const isCheckedBool = String(is_checked) === 'true';

            if (isCheckedBool) {
                await completionRepo.insert({ utilisateur_id, module_id, cours_id });
                res.json({ success: true, message: 'Module marqué comme terminé !' });
            } else {
                await completionRepo.deleteByIdCoursUser(utilisateur_id, module_id);
                res.json({ success: true, message: 'Complétion annulée' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur serveur : ' + error.message });
        }
    }
}

module.exports = new ModuleController();
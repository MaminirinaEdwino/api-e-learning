const formationRepo = require('../repositories/formationRepositories');
const contenuRepo = require('../repositories/contenuFormationRepositories');
const inscriptionRepo = require('../repositories/inscriptionRepositories');
const journalRepo = require('../repositories/journalActiviteRepositories');

class AdminFormationController {

    // --- LISTE GLOBALE ---
    async listGestion(req, res) {
        console.log("teste")
        
        try {
            const formations = await formationRepo.getAllByNom();
            // const sousFormations = await contenuRepo.getSousFormation();
            const inscriptions = await inscriptionRepo.getAll();
            
            res.json({
                formations: formations,
                inscriptions: inscriptions
            });
        } catch (error) {
            res.status(500).send("Erreur de chargement de la gestion."+ error);
        }
    }

    // --- CRÉATION FORMATION ---
    async createFormation(req, res) {
        const { nom_formation } = req.body;
        const userId = req.user.id;
        console.log(req.user.id)
        try {
            await formationRepo.insert({ nom_formation: nom_formation.trim() });
            
            // Journal d'activité
            await journalRepo.insert({
                admin_id: userId,
                action: 'Ajout Formation',
                details: `Formation ajoutée: ${nom_formation}`
            });

            res.json({
                utilisateur_id: userId,
                action: 'Ajout Formation',
                details: `Formation ajoutée: ${nom_formation}`
            });
        } catch (error) {
            res.status(500).send("Erreur lors de l'ajout.\n"+error);
        }
    }

    // --- CRÉATION SOUS-FORMATION ---
    async createSousFormation(req, res) {
        const { id_formation, sous_formation } = req.body;
        const userId = req.user.id;

        try {
            await contenuRepo.insert({
                id_formation: id_formation,
                sous_formation: sous_formation.trim()
            });

            await journalRepo.insert({
                admin_id: userId,
                action: 'Ajout sous formation',
                details: `Sous-formation ajoutée: ${sous_formation} (Parent ID: ${id_formation})`
            });

            res.json({
                admin_id: userId,
                action: 'Ajout sous formation',
                details: `Sous-formation ajoutée: ${sous_formation} (Parent ID: ${id_formation})`
            });
        } catch (error) {
            res.status(500).send("Erreur sous-formation.\n"+error);
        }
    }

    // --- ÉDITION FORMATION (POST) ---
    async updateFormation(req, res) {
        const { id } = req.params;
        const { nouveau_nom } = req.body;

        try {
            await formationRepo.update(id, { nom_formation: nouveau_nom.trim() });
            
            await journalRepo.insert({
                utilisateur_id: req.session.user_id,
                action: 'Modification Formation',
                details: `Modification formation ID ${id} vers: ${nouveau_nom}`
            });

            res.redirect('/gestion/formation');
        } catch (error) {
            res.status(500).send("Erreur modification.");
        }
    }

    // --- SUPPRESSION SOUS-FORMATION ---
    async deleteContenu(req, res) {
        const { id } = req.params;
        try {
            const contenu = await contenuRepo.getById(id);
            const parentId = contenu.formation_id;
            
            await contenuRepo.delete(id);
            res.redirect(`/gestion/formation/${parentId}`);
        } catch (error) {
            res.status(500).send("Erreur suppression.");
        }
    }
}

module.exports = new AdminFormationController();
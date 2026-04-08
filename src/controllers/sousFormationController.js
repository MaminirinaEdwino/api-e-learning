const sousFormationRepo = require('../repositories/contenuFormationRepositories');

class SousFormationController {
    /**
     * Récupère les sous-formations liées à une formation parente
     * Retourne les données au format JSON
     */
    async getByFormation(req, res) {
        try {
            const formationId = parseInt(req.params.id);
            
            if (isNaN(formationId)) {
                return res.status(400).json({ error: "ID de formation invalide" });
            }

            const sousFormations = await sousFormationRepo.getSousFormationAsJson(formationId);

            // res.json() gère automatiquement l'en-tête Content-Type et le formatage
            res.json(sousFormations);
        } catch (error) {
            console.error("Erreur API Sous-Formation :", error);
            res.status(500).json({ error: "Erreur lors de la récupération des données" });
        }
    }
}

module.exports = new SousFormationController();
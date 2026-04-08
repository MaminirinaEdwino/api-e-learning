const formationRepo = require('../repositories/formationRepositories');
const coursRepo = require('../repositories/coursRepositories');

class FormationController {
    /**
     * Affiche le catalogue complet des formations et des cours
     */
    async catalogue(req, res) {
        try {
            // Récupération de toutes les catégories de formation
            const formations = await formationRepo.getAll();
            
            // Récupération des cours destinés au catalogue
            const cours = await coursRepo.getCoursCatalogue();

            // Rendu de la vue avec les données (équivalent à TemplateRender::render)
            res.render('formations/catalogue', { 
                formations, 
                cours 
            });
        } catch (error) {
            console.error("Erreur lors du chargement du catalogue :", error);
            res.status(500).send("Erreur serveur lors de la récupération des formations.");
        }
    }
}

module.exports = new FormationController();
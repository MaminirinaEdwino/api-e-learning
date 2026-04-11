const formationRepo = require('../repositories/formationRepositories');
const coursRepo = require('../repositories/coursRepositories');
const forumRepo = require('../repositories/forumRepositories');
const inscriptionRepo = require('../repositories/inscriptionRepositories');
const Inscription = require('../models/inscriptions.model'); // Import du modèle pour l'instanciation

class ApprenantController {

    /**
     * Page d'accueil de l'espace apprenant (Catalogue)
     */
    async dashboard(req, res) {
        try {
            const formations = await formationRepo.getAllByNom();
            const cours = await coursRepo.getCoursFormation();
            const forums = await forumRepo.getByCours();

            res.json({
                formations: formations,
                cours: cours,
                forums: forums
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors du chargement du catalogue." + error);
        }
    }

    /**
     * Page de progression globale
     */
    async progression(req, res) {
        // Le middleware authCheckerNode gérera la redirection si non connecté
        const cours = await coursRepo.getCoursProgression(req.user.id);
        res.json({ cours: cours });
    }

    /**
     * Liste des cours auxquels l'utilisateur est inscrit
     */
    async mesCours(req, res) {
        const userId = req.user.id;

        const cours = await coursRepo.getByUser(userId);
        // On récupère le statut (payé, en attente, etc.) pour chaque cours
        const coursStatus = await coursRepo.getCoursStatus(cours, userId);

        res.json( {
            cours: cours,
            cours_status: coursStatus
        });
    }

    /**
     * Inscription à un cours (POST)
     */
    async enroll(req, res) {
        const userId = req.session.user_id;
        const { cours_id, references_payement, method_payement } = req.body;

        try {
            // 1. Vérifier si déjà inscrit
            const enrolled = await inscriptionRepo.getEnrolledCours(userId, cours_id);

            if (enrolled) {
                // Si vous préférez JSON (décommenté dans votre PHP) :
                // return res.json({ success: false, message: 'Déjà inscrit' });
                req.session.error = "Vous êtes déjà inscrit à ce cours.";
                return res.redirect(`/cours/apprenant/${cours_id}`);
            }

            // 2. Création de l'inscription
            await inscriptionRepo.insert({
                utilisateur_id: userId,
                cours_id: cours_id,
                statut_paiement: 'en_attente',
                reference_paiement: references_payement,
                methode_paiement: method_payement
            });

            res.redirect(`/cours/apprenant/${cours_id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de l'inscription.");
        }
    }
}

module.exports = new ApprenantController();
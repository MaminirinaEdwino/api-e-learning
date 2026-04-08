const forumRepo = require('../repositories/forumRepositories');
const formationRepo = require('../repositories/formationRepositories');
const postRepo = require('../repositories/postRepositories');
const journalRepo = require('../repositories/journalActiviteRepositories');

class AdminForumController {

    /**
     * Liste des forums pour la modération
     */
    async listGestion(req, res) {
        try {
            // Dans votre PHP, vous utilisiez FormationRepositories pour récupérer les forums
            // On conserve cette logique si GetForGestionForum y est défini
            const forums = await formationRepo.getForGestionForum();
            
            res.render('admin/gestionForum', { forums });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de la récupération des forums.");
        }
    }

    /**
     * Suppression d'un forum (POST)
     */
    async deleteForum(req, res) {
        const forumId = parseInt(req.params.id);
        const userId = req.session.user_id;

        try {
            // Suppression physique ou logique via le repo
            await forumRepo.delete(forumId);

            // Audit
            await journalRepo.insert({
                utilisateur_id: userId,
                action: 'Delete Forum',
                details: `Suppression du forum ${forumId}`
            });

            res.redirect('/gestion/forum');
        } catch (error) {
            res.status(500).send("Erreur lors de la suppression.");
        }
    }

    /**
     * Modification d'un forum (POST)
     */
    async updateForum(req, res) {
        const { forum_id, titre, description } = req.body;
        const userId = req.session.user_id;

        try {
            await forumRepo.update(forum_id, {
                titre: titre.trim(),
                description: description.trim()
            });

            // Audit
            await journalRepo.insert({
                utilisateur_id: userId,
                action: 'update forum',
                details: `Modification du forum ${forum_id}`
            });

            res.redirect('/gestion/forum');
        } catch (error) {
            res.status(500).send("Erreur lors de la modification.");
        }
    }

    /**
     * Visualisation des messages d'un forum
     */
    async viewMessages(req, res) {
        const forumId = parseInt(req.params.id);
        const userId = req.session.user_id;

        try {
            const forum = await forumRepo.getFromForumCours(forumId);
            const posts = await postRepo.getPostFormateurIndicator(forumId);

            // Audit de visualisation
            await journalRepo.insert({
                utilisateur_id: userId,
                action: 'Visualisation message',
                details: 'Visualisation des messages'
            });

            res.render('admin/voirMessage', {
                forums: forum,
                posts: posts
            });
        } catch (error) {
            res.status(500).send("Erreur lors de la visualisation des messages.");
        }
    }
}

module.exports = new AdminForumController();
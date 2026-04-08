const postRepo = require('../repositories/postRepositories');

class PostController {
    /**
     * Création d'un nouveau message (Post) dans un forum
     */
    async createPost(req, res) {
        try {
            const { contenu, forum_id, cours_id } = req.body;
            const contentTrimmed = contenu ? contenu.trim() : '';
            
            let auteurId = null;
            let redirectType = "";

            // Logique de détection de l'auteur (Apprenant vs Formateur)
            if (req.session.user_id) {
                auteurId = req.session.user_id;
                redirectType = "user";
            } else if (req.session.formateur_id) {
                auteurId = req.session.formateur_id;
                redirectType = "formateur";
            }

            if (!auteurId) {
                return res.redirect('/connexion');
            }

            // Insertion en base de données
            await postRepo.insert({
                auteur_id: auteurId,
                forum_id: parseInt(forum_id),
                contenu: contentTrimmed
            });

            // Redirection dynamique
            if (redirectType === "formateur") {
                // Le formateur retourne à la vue des forums du cours
                return res.redirect(`/forum/cours/${cours_id}`);
            }
            
            // L'apprenant retourne à la discussion spécifique
            res.redirect(`/espace/apprenant/forum/${forum_id}`);

        } catch (error) {
            console.error("Erreur lors de la création du post:", error);
            res.status(500).send("Une erreur est survenue lors de l'envoi du message.");
        }
    }
}

module.exports = new PostController();
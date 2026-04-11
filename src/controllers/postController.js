const postRepo = require('../repositories/postRepositories');

class PostController {
    /**
     * Création d'un nouveau message (Post) dans un forum
     */
    async createPost(req, res) {
        try {
            const { contenu, forum_id } = req.body;
            const contentTrimmed = contenu ? contenu.trim() : '';

            // Logique de détection de l'auteur (Apprenant vs Formateur)
            

            // Insertion en base de données
            await postRepo.insert({
                auteur_id: req.user.id,
                forum_id: parseInt(forum_id),
                contenu: contentTrimmed
            });

            // Redirection dynamique
            res.json({
                message: "Post inserted"
            })

        } catch (error) {
            console.error("Erreur lors de la création du post:", error);
            res.status(500).send("Une erreur est survenue lors de l'envoi du message."+error);
        }
    }
}

module.exports = new PostController();
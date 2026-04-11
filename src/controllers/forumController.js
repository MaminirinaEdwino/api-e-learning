const forumRepo = require('../repositories/forumRepositories');
const postRepo = require('../repositories/postRepositories');
const coursRepo = require('../repositories/coursRepositories');

class ForumController {
    async getAll(req, res){
        let forum = await forumRepo.getAll()
        res.json(
             forum
        )
    }
    
    // --- CRÉATION D'UN FORUM ---
    async createForum(req, res) {
        try {
            const { titre, description, cours_id } = req.body;
            
            // Insertion via le Repositories
            await forumRepo.insert({
                cours_id: parseInt(cours_id),
                titre: titre.trim(),
                description: description ? description.trim() : ''
            });

            res.json({
                message: "forum created"
            });
        } catch (error) {
            console.error("Erreur création forum:", error);
            res.status(500).send("Erreur lors de la création du forum.");
        }
    }

    // --- VUE FORMATEUR : FORUMS D'UN COURS ---
    async listForumsByCours(req, res) {
        const cours_id = parseInt(req.params.id);
        const formateur_id = req.user.id;

        try {
            const cours = await coursRepo.getFormateurCours(cours_id, formateur_id);
            const forums = await forumRepo.getByCoursId(cours_id);

            // Récupération des posts avec indicateur formateur
            const posts = {};
            await Promise.all(forums.map(async (forum) => {
                posts[forum.id] = await postRepo.getPostFormateurIndicator(forum.id);
            }));

            res.json({
                cours_id: cours_id,
                cours: cours,
                forums: forums,
                posts: posts
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur chargement des forums."+error);
        }
    }

    // --- VUE APPRENANT : CONTENU D'UN FORUM ---
    async showForumApprenant(req, res) {
        const forum_id = parseInt(req.params.id);
        const user_id = req.session.user_id;

        try {
            const forum = await forumRepo.getFromForumCours(forum_id);
            const posts = await postRepo.getPostByForumUser(user_id, forum_id);

            res.json({
                forum_id,
                forum,
                posts
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur chargement du forum."+error);
        }
    }
}

module.exports = new ForumController();
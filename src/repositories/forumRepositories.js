const { Forum, Cours } = require('../models/index')
class ForumRepositories {

    /**
     * Équivalent de Insert
     * @param {Object} data - { cours_id, titre, description }
     */
    async insert(data) {
        return await Forum.create({
            cours_id: data.cours_id,
            titre: data.titre,
            description: data.description
        });
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await Forum.findAll();
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await Forum.findByPk(id);
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await Forum.update({
            titre: data.titre,
            description: data.description
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await Forum.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetByCours (Récupère tous les forums avec le titre du cours associé)
     */
    async getAllWithCoursTitre() {
        return await Forum.findAll({
            include: [{
                model: Cours,
                attributes: [['titre', 'cours_titre']],
                required: true // INNER JOIN
            }],
            raw: true,
            nest: true
        });
    }

    /**
     * Équivalent de GetFromForumCours (Un forum spécifique avec son titre de cours)
     */
    async getByIdWithCoursTitre(forumId) {
        return await Forum.findByPk(forumId, {
            include: [{
                model: Cours,
                attributes: [['titre', 'cours_titre']],
                required: true
            }]
        });
    }

    /**
     * Équivalent de GetByCoursId (Tous les forums liés à un cours spécifique)
     */
    async getByCoursId(coursId) {
        return await Forum.findAll({
            where: { cours_id: coursId }
        });
    }
    async getByCours() {
        try {
            const forums = await Forum.findAll({
                // On sélectionne toutes les colonnes de Forum (f.*)
                // On inclut le modèle Cours (le JOIN)
                include: [{
                    model: Cours,
                    attributes: ['titre'], // On ne récupère que le titre (c.titre)
                    required: true // Force un INNER JOIN (exclut les forums sans cours)
                }],
                // raw et nest permettent d'obtenir un format d'objet propre
                raw: true,
                nest: true
            });

            // Pour correspondre exactement à ton alias PHP "cours_titre" :
            return forums.map(f => ({
                ...f,
                cours_titre: f.Cours ? f.Cours.titre : null
            }));

        } catch (error) {
            console.error("Erreur lors de la récupération des forums :", error);
            throw error;
        }
    }

    async getFromForumCours(forumId) {
        try {
            const forum = await Forum.findOne({
                where: { id: forumId },
                include: [{
                    model: Cours, // L'alias défini dans tes associations
                    attributes: ['titre'] // On ne récupère que le titre du cours
                }],
                raw: true,
                nest: true // Organise le titre du cours dans un sous-objet
            });

            // Formatage pour correspondre à ton PHP : { ..., cours_titre: "Nom" }
            if (forum && forum.Cours) {
                forum.cours_titre = forum.Cours.titre;
                delete forum.Cours; // Optionnel : nettoie le sous-objet pour aplatir le résultat
            }

            return forum;
        } catch (error) {
            console.error("Erreur lors de la récupération du forum et de son cours :", error);
            throw error;
        }
    }
}

module.exports = new ForumRepositories();
const Forum = require('../models/forum.model');
const Cours = require('../models/cours.model');

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
}

module.exports = new ForumRepositories();
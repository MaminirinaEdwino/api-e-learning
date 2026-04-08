const Formation = require('../models/formation.model');
const Forum = require('../models/forum.model');
const Cours = require('../models/cours.model');

class FormationRepositories {
    
    // Équivalent de Insert
    async insert(data) {
        // data contient { nom_formation: '...' }
        return await Formation.create(data);
    }

    // Équivalent de Delete
    async delete(id) {
        return await Formation.destroy({
            where: { id_formation: id }
        });
    }

    // Équivalent de Update
    async update(id, data) {
        return await Formation.update({
            nom_formation: data.nom_formation
        }, {
            where: { id_formation: id }
        });
    }

    // Équivalent de GetAll
    async getAll() {
        return await Formation.findAll();
    }

    // Équivalent de GetAllByNom
    async getAllByNom() {
        return await Formation.findAll({
            order: [['nom_formation', 'ASC']]
        });
    }

    // Équivalent de GetById
    async getById(id) {
        return await Formation.findByPk(id);
    }

    // Équivalent de GetForGestionForum
    // Note : Cette méthode SQL originale semble appartenir à un ForumRepositories, 
    // mais je la convertis ici pour respecter votre structure.
    async getForGestionForum() {
        return await Forum.findAll({
            include: [{
                model: Cours,
                attributes: ['titre'],
                required: true // INNER JOIN
            }],
            order: [['date_creation', 'DESC']],
            raw: true,
            nest: true
        });
    }
}

module.exports = new FormationRepositories();
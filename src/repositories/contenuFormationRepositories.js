const {ContenuFormation, Formation} = require('../models/index');

class ContenuFormationRepositories {
    
    // Équivalent de Insert
    async insert(data) {
        return await ContenuFormation.create({
            id_formation: data.id_formation,
            sous_formation: data.sous_formation
        });
    }

    // Équivalent de GetAll
    async getAll() {
        return await ContenuFormation.findAll();
    }

    // Équivalent de GetById
    async getById(id) {
        return await ContenuFormation.findByPk(id);
    }

    // Équivalent de Update
    async update(id, data) {
        return await ContenuFormation.update({
            id_formation: data.id_formation,
            sous_formation: data.sous_formation
        }, {
            where: { id_contenu_formation: id }
        });
    }

    // Équivalent de Delete
    async delete(id) {
        return await ContenuFormation.destroy({
            where: { id_contenu_formation: id }
        });
    }

    // Équivalent de GetSousFormationAsJson
    async getByFormationId(formation_id) {
        return await ContenuFormation.findAll({
            where: { id_formation: formation_id },
            attributes: ['id_contenu_formation', 'sous_formation'],
            order: [['sous_formation', 'ASC']]
        });
    }

    // Équivalent de GetSousFormation (avec JOIN sur Formations)
    async getWithFormationDetails() {
        return await ContenuFormation.findAll({
            include: [{
                model: Formation,
                attributes: ['nom_formation'],
                required: true
            }],
            order: [
                [Formation, 'nom_formation', 'ASC'],
                ['sous_formation', 'ASC']
            ]
        });
    }

    // Équivalent de CountSousFormation
    async countByFormation(formation_id) {
        return await ContenuFormation.count({
            where: { id_formation: formation_id }
        });
    }

    // Équivalent de GetContenuFormation (Détails d'un contenu spécifique avec son parent)
    async getContenuWithParent(id) {
        return await ContenuFormation.findByPk(id, {
            include: [{
                model: Formation,
                attributes: ['nom_formation', 'id_formation'],
                required: true
            }]
        });
    }
}

module.exports = new ContenuFormationRepositories();
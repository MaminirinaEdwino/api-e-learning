const Lecon = require('../models/lecon.model');

class LeconRepositories {

    /**
     * Équivalent de Insert
     * @param {Object} data - { module_id, titre, format, fichier }
     */
    async insert(data) {
        return await Lecon.create({
            module_id: data.module_id,
            titre: data.titre,
            format: data.format,
            fichier: data.fichier
        });
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await Lecon.findAll();
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await Lecon.findByPk(id);
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await Lecon.update({
            module_id: data.module_id,
            titre: data.titre,
            format: data.format,
            fichier: data.fichier
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await Lecon.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetByModuleId (et GetByModuleId2)
     * Récupère toutes les leçons rattachées à un module
     */
    async getByModuleId(moduleId) {
        return await Lecon.findAll({
            where: { module_id: moduleId }
        });
    }

    /**
     * Équivalent de DeleteByModuleId
     * Utile pour le nettoyage lors de la suppression d'un module
     */
    async deleteByModuleId(moduleId) {
        return await Lecon.destroy({
            where: { module_id: moduleId }
        });
    }
}

module.exports = new LeconRepositories();
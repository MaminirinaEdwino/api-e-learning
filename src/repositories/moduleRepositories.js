const { Op } = require('sequelize');
const Module = require('../models/module.model');
const Completion = require('../models/completion.model'); // Table pour GetModuletermine

class ModuleRepositories {

    /**
     * Équivalent de Insert
     * Retourne l'ID généré
     */
    async insert(data) {
        const newModule = await Module.create({
            cours_id: data.cours_id,
            titre: data.titre,
            description: data.description
        });
        return newModule.id;
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await Module.findAll();
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await Module.findByPk(id);
    }

    /**
     * Équivalent de GetByIdCoursId
     * Vérifie l'existence d'un module spécifique pour un cours donné
     */
    async getByIdAndCoursId(module_id, cours_id) {
        return await Module.findOne({
            where: { id: module_id, cours_id: cours_id },
            attributes: ['id']
        });
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await Module.update({
            cours_id: data.cours_id,
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
        return await Module.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetByCoursId, GetByCoursId2, GetByCoursIdArray
     * Sequelize retourne nativement un tableau d'objets (ou instances)
     */
    async getByCoursId(cours_id) {
        return await Module.findAll({
            where: { cours_id: cours_id }
        });
    }

    /**
     * Équivalent de GetTotalModule
     */
    async countByCoursId(cours_id) {
        return await Module.count({
            where: { cours_id: cours_id }
        });
    }

    /**
     * Équivalent de GetModuletermine
     * Récupère les titres des modules terminés par un utilisateur pour un cours
     */
    async getCompletedModulesTitles(userId, coursId) {
        const completions = await Completion.findAll({
            where: { utilisateur_id: userId, cours_id: coursId },
            include: [{
                model: Module,
                attributes: ['titre'],
                required: true
            }],
            raw: true
        });
        // On mappe pour retourner uniquement un tableau de chaînes (titres)
        return completions.map(c => c['Module.titre']);
    }

    /**
     * Équivalent de DeleteByCoursId
     */
    async deleteByCoursId(cours_id) {
        return await Module.destroy({
            where: { cours_id: cours_id }
        });
    }
}

module.exports = new ModuleRepositories();
const { Completion } = require('../models/index');
const { Op } = require('sequelize');

class CompletionRepositories {

    // Équivalent de Insert
    async insert(data) {
        // En Sequelize, on peut passer directement un objet 
        // ou une instance du modèle
        return await Completion.create({
            utilisateur_id: data.utilisateur_id,
            module_id: data.module_id,
            cours_id: data.cours_id
        });
    }

    // Équivalent de DeleteByIdCoursUd (Correction du nom : DeleteByUserAndModule)
    async deleteByUserAndModule(utilisateur_id, module_id) {
        return await Completion.destroy({
            where: {
                utilisateur_id: utilisateur_id,
                module_id: module_id
            }
        });
    }

    // Équivalent de GetAll
    async getAll() {
        return await Completion.findAll();
    }

    // Équivalent de GetByUtilisateur
    async getByUtilisateur(utilisateur_id) {
        return await Completion.findAll({
            where: { utilisateur_id }
        });
    }

    // Équivalent de GetByModuleId
    async getByModuleId(module_id) {
        return await Completion.findAll({
            where: { module_id }
        });
    }

    // Équivalent de GetByCoursId
    async getByCoursId(cours_id) {
        return await Completion.findAll({
            where: { cours_id }
        });
    }

    // Équivalent de GetById
    async getById(id) {
        return await Completion.findByPk(id);
    }

    // Équivalent de GetByCoursUserId (Retourne juste la liste des IDs de modules)
    async getCompletedModuleIds(cours_id, utilisateur_id) {
        const completions = await Completion.findAll({
            where: {
                cours_id: cours_id,
                utilisateur_id: utilisateur_id
            },
            attributes: ['module_id'] // On ne récupère que la colonne module_id
        });
        // On transforme le tableau d'objets en tableau de nombres simple [1, 2, 5]
        return completions.map(c => c.module_id);
    }

    // Équivalent de DeleteByCoursId
    async deleteByCoursId(cours_id) {
        return await Completion.destroy({
            where: { cours_id }
        });
    }

    // Équivalent de DeleteByModueId
    async deleteByModuleId(module_id) {
        return await Completion.destroy({
            where: { module_id }
        });
    }

    // Équivalent de GetCompleteModule (Compte le nombre de modules complétés)
    async countCompletedModules(utilisateur_id, cours_id) {
        return await Completion.count({
            where: {
                utilisateur_id: utilisateur_id,
                cours_id: cours_id
            }
        });
    }
}

module.exports = new CompletionRepositories();
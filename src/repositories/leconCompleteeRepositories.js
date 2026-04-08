const LeconCompletee = require('../models/lecon.modelCompletee');

class LeconCompleteeRepositories {

    /**
     * Équivalent de Insert
     * Marque une leçon comme terminée pour un utilisateur
     */
    async insert(data) {
        // data contient { utilisateur_id, lecon_id }
        return await LeconCompletee.create({
            utilisateur_id: data.utilisateur_id,
            lecon_id: data.lecon_id
        });
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await LeconCompletee.findAll();
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await LeconCompletee.findByPk(id);
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await LeconCompletee.update({
            utilisateur_id: data.utilisateur_id,
            lecon_id: data.lecon_id
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await LeconCompletee.destroy({
            where: { id: id }
        });
    }

    /**
     * Méthode utile additionnelle : Vérifier si une leçon est déjà complétée
     */
    async isAlreadyCompleted(utilisateur_id, lecon_id) {
        const count = await LeconCompletee.count({
            where: {
                utilisateur_id: utilisateur_id,
                lecon_id: lecon_id
            }
        });
        return count > 0;
    }
}

module.exports = new LeconCompleteeRepositories();
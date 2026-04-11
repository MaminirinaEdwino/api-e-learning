const { Op, fn, col, literal } = require('sequelize');

const { JournalActivite, User } = require('../models/index')

class JournalActiviteRepositories {

    /**
     * Équivalent de Insert
     */
    async insert(data) {
        return await JournalActivite.create({
            admin_id: data.admin_id,
            action: data.action,
            details: data.details
        });
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await JournalActivite.findAll();
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await JournalActivite.findByPk(id);
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await JournalActivite.update({
            admin_id: data.admin_id,
            action: data.action,
            details: data.details
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await JournalActivite.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetFilterLog
     * Gère la recherche globale et le tri dynamique
     */
    async getFilterLog(search, sortColumn = 'created_at', order = 'DESC') {
        const queryOptions = {
            include: [{
                model: User,
                attributes: ['nom'],
                required: true
            }],
            order: [],
            raw: true,
            nest: true
        };

        // Gestion du tri (cas particulier pour le nom de l'utilisateur)
        if (sortColumn === 'nom') {
            queryOptions.order.push([Utilisateur, 'nom', order]);
        } else {
            queryOptions.order.push([sortColumn, order]);
        }

        // Gestion de la recherche (Op.or)
        if (search) {
            const searchTerm = `%${search}%`;
            queryOptions.where = {
                [Op.or]: [
                    { action: { [Op.like]: searchTerm } },
                    { details: { [Op.like]: searchTerm } },
                    { '$Utilisateur.nom$': { [Op.like]: searchTerm } },
                    { created_at: { [Op.like]: searchTerm } }
                ]
            };
        }

        return await JournalActivite.findAll(queryOptions);
    }

    /**
     * Équivalent de MarkRead
     * Note: Dans Node.js, l'ID utilisateur doit être passé en paramètre 
     * car il n'y a pas de variable $_SESSION globale.
     */
    async logMarkRead(adminId) {
        return await this.insert({
            admin_id: adminId,
            action: 'Marquer notifications comme lues',
            details: 'Notifications des dernières 24 heures'
        });
    }

    /**
     * Équivalent de DeactivateUser
     */
    async logDeactivation(adminId, targetUserId) {
        return await this.insert({
            admin_id: adminId,
            action: 'Désactivation de compte',
            details: `Utilisateur ID: ${targetUserId}`
        });
    }

    /**
     * Équivalent de CountLog (Activités du jour uniquement)
     */
    async countTodayLogs() {
        return await JournalActivite.count({
            where: {
                created_at: {
                    [Op.gte]: fn('CURDATE')
                }
            }
        });
    }

    /**
     * Équivalent de GetLastLog
     */
    async getLastLogs(limit = 5) {
        return await JournalActivite.findAll({
            order: [['created_at', 'DESC']],
            limit: limit,
            raw: true,
            nest: true
        });
    }
    async markRead(userId) {
        try {
            // .create() génère automatiquement le "INSERT INTO journal_activite ..."
            await JournalActivite.create({
                admin_id: userId,
                action: 'Marquer notifications comme lues',
                details: 'Notifications des dernières 24 heures'
            });

            return true;
        } catch (error) {
            console.error("Erreur lors de l'enregistrement dans le journal :", error);
            throw error;
        }
    }
    async logDeactivation(adminId, targetUserId) {
    try {
        // .create() génère l'INSERT INTO journal_activite...
        await JournalActivite.create({
            admin_id: adminId,
            action: 'Désactivation de compte',
            details: `Utilisateur ID: ${targetUserId}`
        });

        return true;
    } catch (error) {
        console.error("Erreur lors du log de désactivation :", error);
        throw error;
    }
}
}

module.exports = new JournalActiviteRepositories();
const { Op } = require('sequelize');


const {ForumMessage , User, Cours} = require('../models/index')

class ForumMessageRepositories {

    /**
     * Équivalent de Insert
     */
    async insert(data) {
        return await ForumMessage.create({
            cours_id: data.cours_id,
            utilisateur_id: data.utilisateur_id,
            message: data.message
        });
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await ForumMessage.findAll();
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await ForumMessage.findByPk(id);
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await ForumMessage.update({
            cours_id: data.cours_id,
            utilisateur_id: data.utilisateur_id,
            message: data.message,
            lu: data.lu
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await ForumMessage.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetNotifications
     * Récupère les 5 derniers messages non lus des cours d'un formateur spécifique
     */
    async getNotifications(formateur_id) {
        return await ForumMessage.findAll({
            attributes: ['id', 'message', 'date'],
            where: { lu: false },
            include: [
                {
                    model: User,
                    as: "auteur",
                    attributes: [['nom', 'utilisateur_nom']]
                },
                {
                    model: Cours,
                    attributes: [['titre', 'cours_titre']],
                    where: { formateur_id: formateur_id } // Filtre par formateur via la jointure
                }
            ],
            order: [['date', 'DESC']],
            limit: 5,
            raw: true,
            nest: true
        });
    }

    /**
     * Optionnel : Marquer comme lu (Utile pour vider les notifications)
     */
    async markAsRead(messageId) {
        return await ForumMessage.update({ lu: true }, {
            where: { id: messageId }
        });
    }
}

module.exports = new ForumMessageRepositories();
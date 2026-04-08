const { Op } = require('sequelize');
const Inscription = require('../models/Inscription');
const Cours = require('../models/Cours');
const Utilisateur = require('../models/Utilisateur');

class InscriptionRepository {

    /**
     * Équivalent de Insert
     * Retourne l'ID de l'enregistrement créé
     */
    async insert(data) {
        const newInscription = await Inscription.create({
            utilisateur_id: data.utilisateur_id,
            cours_id: data.cours_id,
            references_payement: data.references_payement,
            method_payement: data.method_payement
        });
        return newInscription.id;
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await Inscription.findAll({
            order: [['date_inscription', 'DESC']]
        });
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await Inscription.findByPk(id);
    }

    /**
     * Équivalent de GetUserCoursInscription
     * Vérifie s'il existe une inscription active ou en attente
     */
    async checkExistingInscription(utilisateur_id, cours_id) {
        return await Inscription.count({
            where: {
                utilisateur_id: utilisateur_id,
                cours_id: cours_id,
                statut_paiement: {
                    [Op.in]: ['paye', 'en_attente']
                }
            }
        });
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await Inscription.update({
            utilisateur_id: data.utilisateur_id,
            cours_id: data.cours_id,
            statut_paiement: data.statut_paiement
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de DeleteByCoursId
     */
    async deleteByCoursId(cours_id) {
        return await Inscription.destroy({
            where: { cours_id: cours_id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await Inscription.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetEnrolledCours
     */
    async isEnrolled(utilisateur_id, cours_id) {
        const count = await Inscription.count({
            where: {
                utilisateur_id: utilisateur_id,
                cours_id: cours_id,
                statut_paiement: 'paye'
            }
        });
        return count > 0;
    }

    /**
     * Équivalent de GetWaitingCours
     */
    async isWaiting(utilisateur_id, cours_id) {
        const count = await Inscription.count({
            where: {
                utilisateur_id: utilisateur_id,
                cours_id: cours_id,
                statut_paiement: 'en_attente'
            }
        });
        return count > 0;
    }

    /**
     * Équivalent de GetProgressionApprenant & GetApprenantCours
     * Récupère les cours payés d'un utilisateur
     */
    async getPaidCoursByUser(utilisateur_id) {
        return await Inscription.findAll({
            where: {
                utilisateur_id: utilisateur_id,
                statut_paiement: 'paye'
            },
            include: [{
                model: Cours,
                attributes: ['id', 'titre']
            }],
            attributes: ['date_inscription'],
            raw: true,
            nest: true
        });
    }

    /**
     * Équivalent de GetApprenantByCoursId
     * Récupère la liste des étudiants inscrits à un cours spécifique
     */
    async getApprenantsByCours(cours_id) {
        return await Inscription.findAll({
            where: {
                cours_id: cours_id,
                statut_paiement: 'paye'
            },
            include: [{
                model: Utilisateur,
                attributes: [['id', 'utilisateur_id'], ['nom', 'utilisateur_nom']]
            }],
            attributes: [], // On ne veut pas les colonnes de la table inscription
            raw: true,
            nest: true
        });
    }
}

module.exports = new InscriptionRepository();
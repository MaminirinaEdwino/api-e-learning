const { Op } = require('sequelize');
const { Inscription, Cours, User } = require('../models/index')

class InscriptionRepositories {

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
                model: User,
                attributes: [['id', 'utilisateur_id'], ['nom', 'utilisateur_nom']]
            }],
            attributes: [], // On ne veut pas les colonnes de la table inscription
            raw: true,
            nest: true
        });
    }
    async getEnrolledCours(utilisateurId, coursId) {
        try {
            const inscription = await Inscription.findOne({
                where: {
                    utilisateur_id: utilisateurId,
                    cours_id: coursId,
                    statut_paiement: 'paye'
                },
                attributes: ['id'], // On ne récupère que l'ID pour optimiser la performance
                raw: true
            });

            // Retourne true si une inscription existe, sinon false
            return inscription !== null;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'inscription :", error);
            throw error;
        }
    }
    async getApprenantByCoursId(coursId) {
        try {
            const apprenants = await Inscription.findAll({
                where: {
                    cours_id: coursId,
                    statut_paiement: 'paye'
                },
                include: [{
                    model: User,
                    attributes: ['id', 'nom'] // Équivalent de u.id et u.nom
                }],
                raw: true,
                nest: true
            });

            // Formatage pour obtenir un tableau plat comme en PHP
            return apprenants.map(i => {
                // Sécurité : on vérifie si l'objet 'auteur' existe avant d'accéder à .id
                const user = i.auteur;

                if (!user) {
                    console.warn(`Inscription ${i.id} sans utilisateur trouvé.`);
                    return null;
                }

                return {
                    utilisateur_id: user.id,
                    utilisateur_nom: user.nom
                };
            }).filter(item => item !== null);

        } catch (error) {
            console.error("Erreur lors de la récupération des apprenants par cours :", error);
            throw error;
        }
    }
}

module.exports = new InscriptionRepositories();
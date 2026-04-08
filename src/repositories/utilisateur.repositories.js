const { Op, fn, col, literal } = require('sequelize');
const Utilisateur = require('../models/Utilisateur');
const Inscription = require('../models/Inscription');
const Cours = require('../models/Cours');
const Post = require('../models/Post');
const JournalActivite = require('../models/JournalActivite');

class UtilisateurRepository {

    /**
     * Équivalent de Insert
     */
    async insert(data) {
        return await Utilisateur.create(data);
    }

    /**
     * Équivalent de GetActiveUser
     */
    async getActiveApprenants() {
        return await Utilisateur.findAll({
            attributes: ['id', 'nom', 'email'],
            where: {
                role: 'apprenant',
                actif: true
            },
            order: [['nom', 'ASC']]
        });
    }

    /**
     * Équivalent de GetInfoUserCertificat
     */
    async getInfoCertificat(apprenantId, coursId) {
        return await Utilisateur.findOne({
            where: { id: apprenantId },
            attributes: ['nom'],
            include: [{
                model: Inscription,
                where: { cours_id: coursId, statut_paiement: 'paye' },
                required: true,
                include: [{
                    model: Cours,
                    attributes: ['titre'],
                    required: true
                }]
            }],
            raw: true,
            nest: true
        });
    }

    /**
     * Équivalent de CountUserPerMonth
     * Format mois attendu : "YYYY-MM"
     */
    async countApprenantsByMonth(mois) {
        return await Utilisateur.count({
            where: {
                role: 'apprenant',
                [Op.and]: [
                    literal(`DATE_FORMAT(created_at, '%Y-%m') = '${mois}'`)
                ]
            }
        });
    }

    /**
     * Équivalent de GetInactiveUsers
     * Utilisateurs sans activité (Post) depuis plus de 30 jours
     */
    async getInactiveUsers() {
        return await Utilisateur.findAll({
            attributes: [
                'id', 'nom', 'email', 'role', 'actif',
                [literal('MAX(COALESCE("Posts"."date_post", "Utilisateur"."created_at"))'), 'last_activity']
            ],
            include: [{
                model: Post,
                attributes: []
            }],
            group: ['Utilisateur.id'],
            having: literal('last_activity < NOW() - INTERVAL 30 DAY'),
            order: [[literal('last_activity'), 'ASC']],
            limit: 5,
            raw: true
        });
    }

    /**
     * Équivalent de GetForAuth et GetById
     */
    async findByEmail(email) {
        return await Utilisateur.findOne({ where: { email } });
    }

    async findById(id) {
        return await Utilisateur.findByPk(id);
    }

    /**
     * Équivalent de ToggleActive
     * Combine l'update et l'écriture dans le journal (Transaction recommandée en prod)
     */
    async toggleActive(adminId, targetUserId) {
        const user = await Utilisateur.findByPk(targetUserId);
        if (user) {
            const newStatus = !user.actif;
            await user.update({ actif: newStatus });
            
            // Log dans le journal
            await JournalActivite.create({
                admin_id: adminId,
                action: 'Toggle actif utilisateur',
                details: `Utilisateur ID: ${targetUserId} - Nouveau statut: ${newStatus}`
            });
            return newStatus;
        }
        return null;
    }

    /**
     * Équivalent de GetUserGestionUser et GetAdminGestionUser
     */
    async getFilteredUsers(search, roles = ['apprenant'], sortCol = 'nom', order = 'ASC') {
        const whereClause = {
            role: { [Op.in]: roles }
        };

        if (search) {
            whereClause[Op.or] = [
                { nom: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        return await Utilisateur.findAll({
            where: whereClause,
            order: [[sortCol, order]]
        });
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await Utilisateur.update(data, {
            where: { id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await Utilisateur.destroy({
            where: { id }
        });
    }
}

module.exports = new UtilisateurRepository();
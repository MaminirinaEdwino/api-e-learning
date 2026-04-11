const { Op, fn, col, literal } = require('sequelize');

const { User, Inscription, Cours, Post, JournalActivite } = require('../models/index')

class UtilisateurRepositories {

    /**
     * Équivalent de Insert
     */
    async insert(data) {
        return await User.create(data);
    }

    /**
     * Équivalent de GetActiveUser
     */
    async getActiveApprenants() {
        return await User.findAll({
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
        return await User.findOne({
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
    async countApprenant() {
        try {
            const count = await User.count({
                where: {
                    role: 'apprenant'
                }
            });

            return count;
        } catch (error) {
            console.error("Erreur lors du comptage des apprenants :", error);
            throw error;
        }
    }
    async countApprenantsByMonth(mois) {
        return await User.count({
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
        return await User.findAll({
            attributes: [
                'id', 'nom', 'email', 'role', 'actif',
                [literal('MAX(COALESCE(Post.date_post, Utilisateur.created_at))'), 'last_activity']
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
        return await User.findOne({ where: { email } });
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    /**
     * Équivalent de ToggleActive
     * Combine l'update et l'écriture dans le journal (Transaction recommandée en prod)
     */
    async toggleActive(adminId, targetUserId) {
        const user = await User.findByPk(targetUserId);
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

        return await User.findAll({
            where: whereClause,
            order: [[sortCol, order]]
        });
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await User.update(data, {
            where: { id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await User.destroy({
            where: { id }
        });
    }

    async getNewApprenantCount() {
        try {
            // On calcule la date d'il y a 24 heures
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);

            const count = await User.count({
                where: {
                    role: 'apprenant',
                    created_at: {
                        [Op.gte]: oneDayAgo // Op.gte signifie "Greater Than or Equal" (>=)
                    }
                }
            });

            return count;
        } catch (error) {
            console.error("Erreur lors du comptage des nouveaux apprenants :", error);
            throw error;
        }
    }
    async getByEmail(email) {
        try {
            const user = await User.findOne({
                where: {
                    email: email
                },
                // On ne sélectionne que la colonne email comme dans ton code PHP
                attributes: ['email'],
                // Retourne un objet simple au lieu d'une instance Sequelize complète
                raw: true
            });

            // user sera soit { email: "..." } soit null
            return user;
        } catch (error) {
            console.error("Erreur lors de la récupération par email :", error);
            throw error;
        }
    }
    async deactivateUser(userId) {
        try {
            // .update(valeurs, conditions)
            const [updatedRows] = await User.update(
                { actif: 0 },
                {
                    where: {
                        id: userId
                    }
                }
            );

            // updatedRows contient le nombre de lignes modifiées (0 ou 1)
            return updatedRows > 0;
        } catch (error) {
            console.error("Erreur lors de la désactivation de l'utilisateur :", error);
            throw error;
        }
    }
}

module.exports = new UtilisateurRepositories();
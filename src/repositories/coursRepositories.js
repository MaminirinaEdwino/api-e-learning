const { Op, fn, col, literal } = require('sequelize');
const { Cours, Formation, ContenuFormation, Inscription, Module, Completion, User, Quiz, ResultatQuiz } = require('../models/index')

class CoursRepositories {

    // Équivalent de CountCours
    async countAll() {
        return await Cours.count();
    }

    // Équivalent de Insert
    async insert(data) {
        return await Cours.create(data);
    }

    // Équivalent de GetAll
    async getAll() {
        return await Cours.findAll();
    }

    // Équivalent de GetNewCours (Cours créés depuis moins de 24h)
    async getNewCoursCount() {
        return await Cours.count({
            where: {
                created_at: {
                    [Op.gte]: literal('NOW() - INTERVAL 1 DAY')
                }
            }
        });
    }

    // Équivalent de GetById
    async getById(id) {
        return await Cours.findByPk(id);
    }

    // Équivalent de Update
    async update(id, data) {
        return await Cours.update(data, { where: { id } });
    }

    // Équivalent de Delete
    async delete(id) {
        return await Cours.destroy({ where: { id } });
    }

    // Équivalent de GetCoursCatalogue (avec LEFT JOIN)
    async getCatalogue() {
        return await Cours.findAll({
            include: [
                { model: Formation, attributes: [['nom_formation', 'nom_theme']] },
                { model: ContenuFormation, attributes: [['sous_formation', 'nom_sous_theme']] }
            ],
            order: [['titre', 'ASC']],
            raw: true, // Pour obtenir un tableau d'objets simple comme en PHP
            nest: true
        });
    }

    // Équivalent de GetCoursProgression (Calcul complexe Quiz)
    async getCoursProgression(userId) {
        // En Node, on utilise souvent une requête brute (Query) pour ce niveau de complexité SQL
        // ou on définit des associations complexes. Voici la version via Sequelize :
        return await Cours.findAll({
            attributes: [
                'id', 'titre',
                [literal('COUNT(DISTINCT modules->quiz.id)'), 'total_quiz'],
                [literal('COUNT(DISTINCT CASE WHEN modules->quiz->resultats_quiz.score >= modules->quiz.score_minimum THEN modules->quiz->resultats_quiz.id END)'), 'quiz_reussis']
            ],
            include: [{
                model: Inscription,
                where: { utilisateur_id: userId, statut_paiement: 'paye' },
                attributes: []
            }, {
                model: Module,
                include: [{
                    model: Quiz,
                    include: [{
                        model: ResultatQuiz,
                        where: { utilisateur_id: userId },
                        required: false
                    }]
                }]
            }],
            group: ['Cours.id', 'Cours.titre']
        });
    }

    // Équivalent de GetVente (Statistiques formateur)
    async getVentesByFormateur(formateur_id) {
        return await Cours.findAll({
            where: { formateur_id },
            attributes: [
                'titre', 'prix',
                [fn('COUNT', col('inscriptions.id')), 'inscriptions'],
                [fn('SUM', col('prix')), 'revenu']
            ],
            include: [{
                model: Inscription,
                where: { statut_paiement: 'paye' },
                required: false,
                attributes: []
            }],
            group: ['Cours.id', 'Cours.titre', 'Cours.prix']
        });
    }

    // Équivalent de GetApprenant (Progression détaillée pour le formateur)
    async getApprenantsProgression(formateur_id) {
        return await Cours.findAll({
            where: { formateur_id },
            include: [{
                model: Inscription,
                where: { statut_paiement: 'paye' },
                include: [{
                    model: User,
                    attributes: ['id', 'nom']
                }]
            }, {
                model: Module,
                include: [{
                    model: Completion,
                    required: false
                }]
            }]
        });
    }

    // Équivalent de GetLastInsertId
    async getLastInsertId(formateur_id) {
        const result = await Cours.findOne({
            where: { formateur_id },
            order: [['id', 'DESC']],
            attributes: ['id']
        });
        return result ? result.id : null;
    }
    async countCours() {
        try {
            const count = await Cours.count();

            return count;
        } catch (error) {
            console.error("Erreur lors du comptage des apprenants :", error);
            throw error;
        }
    }

    async getCoursFormation() {
        try {
            const result = await Cours.findAll({
                // On inclut le modèle Formation (le LEFT JOIN)
                include: [{
                    model: Formation,
                    attributes: ['id_formation'], // On ne prend que l'ID comme dans ton SQL
                    required: false // Force le LEFT JOIN (par défaut Sequelize fait souvent du INNER si non spécifié)
                }],
                // raw: true aplatit les instances Sequelize en objets JSON simples
                // nest: true permet de garder une structure propre, mais pour coller à ton PHP, 
                // on peut traiter le résultat juste après.
                raw: true,
                nest: true
            });

            // Si tu veux exactement le même format plat que PHP (c.* + f.id_formation) :
            return result.map(item => ({
                ...item,
                id_formation: item.Formation ? item.Formation.id_formation : null
            }));

        } catch (error) {
            console.error("Erreur lors de la récupération des cours et formations :", error);
            throw error;
        }
    }
}

module.exports = new CoursRepositories();
const { Op, fn, col, literal } = require('sequelize');
const Cours = require('../models/cours.model');
const Formation = require('../models/formation.model');
const ContenuFormation = require('../models/contenu_formation.model');
const Inscription = require('../models/inscriptions.model');
const Module = require('../models/module.model');
const Completion = require('../models/completion.model');
const Utilisateur = require('../models/utilisateur.model');
const Quiz = require('../models/quiz.model');
const ResultatQuiz = require('../models/resultat_quiz.model');

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
                    model: Utilisateur,
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
}

module.exports = new CoursRepositories();
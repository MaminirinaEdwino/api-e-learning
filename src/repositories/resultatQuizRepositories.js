const { Op, literal } = require('sequelize');
const ResultatQuiz = require('../models/resultat_quiz.model');
const Quiz = require('../models/quiz.model');
const Module = require('../models/module.model');

class ResultatQuizRepositories {

    /**
     * Équivalent de Insert
     */
    async insert(data) {
        return await ResultatQuiz.create({
            utilisateur_id: data.utilisateur_id,
            quiz_id: data.quiz_id,
            score: data.score
        });
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await ResultatQuiz.findAll();
    }

    /**
     * Équivalent de GetQuizReussis
     * Compte les quiz où le score est supérieur ou égal au minimum requis
     */
    async getQuizReussis(apprenantId, coursId) {
        return await ResultatQuiz.count({
            include: [{
                model: Quiz,
                required: true,
                include: [{
                    model: Module,
                    where: { cours_id: coursId },
                    required: true
                }],
                // Condition : score obtenu >= score_minimum du quiz
                where: literal('"ResultatQuiz"."score" >= "Quiz"."score_minimum"')
            }],
            where: { utilisateur_id: apprenantId }
        });
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await ResultatQuiz.findByPk(id);
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await ResultatQuiz.update({
            utilisateur_id: data.utilisateur_id,
            quiz_id: data.quiz_id,
            score: data.score
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await ResultatQuiz.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetByModuleId
     * Retourne les IDs des quiz complétés pour un module donné
     */
    async getQuizIdsByModule(utilisateurId, moduleId) {
        const results = await ResultatQuiz.findAll({
            attributes: ['quiz_id'],
            where: { utilisateur_id: utilisateurId },
            include: [{
                model: Quiz,
                attributes: [],
                where: { module_id: moduleId },
                required: true
            }],
            raw: true
        });
        return results.map(r => r.quiz_id);
    }

    /**
     * Équivalent de GetByUserIdCoursId
     * Récupère l'historique des scores d'un utilisateur pour un cours
     */
    async getByUserIdAndCoursId(userId, coursId) {
        return await ResultatQuiz.findAll({
            attributes: ['score', 'date'],
            include: [{
                model: Quiz,
                attributes: [['titre', 'quiz_titre'], 'score_minimum'],
                required: true,
                include: [{
                    model: Module,
                    attributes: [],
                    where: { cours_id: coursId },
                    required: true
                }]
            }],
            where: { utilisateur_id: userId },
            raw: true,
            nest: true
        });
    }
}

module.exports = new ResultatQuizRepositories();
const { literal } = require('sequelize');
const Quiz = require('../models/Quiz');
const Module = require('../models/Module');
const Cours = require('../models/Cours');
const Question = require('../models/Question');

class QuizRepository {

    /**
     * Équivalent de Insert
     */
    async insert(data) {
        const newQuiz = await Quiz.create({
            module_id: data.module_id,
            titre: data.titre,
            description: data.description,
            score_minimum: data.score_minimum
        });
        return newQuiz.id;
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await Quiz.findAll();
    }

    /**
     * Équivalent de GetTotalQuiz
     * Compte le nombre de quiz pour un cours via ses modules
     */
    async getTotalQuizByCours(coursId) {
        return await Quiz.count({
            include: [{
                model: Module,
                where: { cours_id: coursId },
                required: true
            }]
        });
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await Quiz.findByPk(id);
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await Quiz.update({
            module_id: data.module_id,
            titre: data.titre,
            description: data.description,
            score_minimum: data.score_minimum
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await Quiz.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetByModuleId
     */
    async getByModuleId(moduleId) {
        return await Quiz.findAll({
            where: { module_id: moduleId }
        });
    }

    /**
     * Équivalent de GetCoursModuleQuizByQuiz
     * Récupère les détails complets du quiz, du module et du cours associé
     */
    async getFullDetails(quizId) {
        return await Quiz.findOne({
            where: { id: quizId },
            include: [{
                model: Module,
                attributes: [['titre', 'module_titre'], 'cours_id'],
                include: [{
                    model: Cours,
                    attributes: [['titre', 'cours_titre'], 'prix']
                }]
            }],
            raw: true,
            nest: true
        });
    }

    /**
     * Équivalent de GetCoursQuizByFormateurId
     * Récupère les quiz avec le nombre de questions (sous-requête)
     */
    async getQuizByFormateur(formateurId) {
        return await Quiz.findAll({
            attributes: [
                'id', 'titre', 'description', 'score_minimum',
                // Sous-requête pour compter les questions : (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id)
                [literal('(SELECT COUNT(*) FROM questions WHERE questions.quiz_id = Quiz.id)'), 'nb_questions']
            ],
            include: [{
                model: Module,
                attributes: [['titre', 'module_titre']],
                required: true,
                include: [{
                    model: Cours,
                    attributes: [['titre', 'cours_titre']],
                    where: { formateur_id: formateurId },
                    required: true
                }]
            }],
            raw: true,
            nest: true
        });
    }

    /**
     * Équivalent de GetQuizByIdFormateurId
     */
    async getByIdAndFormateur(quizId, formateurId) {
        return await Quiz.findOne({
            where: { id: quizId },
            include: [{
                model: Module,
                attributes: [['titre', 'module_titre'], 'cours_id'],
                required: true,
                include: [{
                    model: Cours,
                    attributes: [['titre', 'cours_titre']],
                    where: { formateur_id: formateurId },
                    required: true
                }]
            }],
            raw: true,
            nest: true
        });
    }
}

module.exports = new QuizRepository();
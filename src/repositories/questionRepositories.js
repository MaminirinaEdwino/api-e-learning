const Question = require('../models/questions.model');

class QuestionRepositories {

    /**
     * Équivalent de Insert
     */
    async insert(data) {
        return await Question.create({
            quiz_id: data.quiz_id,
            texte: data.texte,
            reponse_correcte: data.reponse_correcte,
            reponse_incorrecte_1: data.reponse_incorrecte_1,
            reponse_incorrecte_2: data.reponse_incorrecte_2,
            reponse_incorrecte_3: data.reponse_incorrecte_3
        });
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await Question.findAll();
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await Question.findByPk(id);
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await Question.update({
            quiz_id: data.quiz_id,
            texte: data.texte,
            reponse_correcte: data.reponse_correcte,
            reponse_incorrecte_1: data.reponse_incorrecte_1,
            reponse_incorrecte_2: data.reponse_incorrecte_2,
            reponse_incorrecte_3: data.reponse_incorrecte_3
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await Question.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetByQuizId
     * Récupère toutes les questions d'un quiz spécifique
     */
    async getByQuizId(quizId) {
        return await Question.findAll({
            where: { quiz_id: quizId }
        });
    }

    /**
     * Équivalent de DeleteByQuiId
     * Supprime toutes les questions associées à un quiz
     */
    async deleteByQuizId(quizId) {
        return await Question.destroy({
            where: { quiz_id: quizId }
        });
    }
}

module.exports = new QuestionRepositories();
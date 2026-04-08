const quizRepo = require('../repositories/quizRepository');
const questionRepo = require('../repositories/questionRepository');
const inscriptionRepo = require('../repositories/inscriptionRepository');
const coursRepo = require('../repositories/coursRepository');
const moduleRepo = require('../repositories/moduleRepository');

class QuizController {
    
    // --- VUE APPRENANT : PASSER UN QUIZ ---
    async renderTakeQuiz(req, res) {
        const quizId = parseInt(req.params.id);
        const userId = req.session.user_id;

        try {
            const quiz = await quizRepo.getCoursModuleQuizByQuiz(quizId);
            const isEnrolled = await inscriptionRepo.getEnrolledCours(userId, quiz.cours_id);
            const questions = await questionRepo.getByQuizId(quizId);

            res.render('quiz/takequiz', {
                is_enrolled: isEnrolled,
                quiz,
                questions,
                quiz_id: quizId
            });
        } catch (error) {
            res.status(500).send("Erreur lors de l'accès au quiz.");
        }
    }

    // --- LISTE FORMATEUR ---
    async listByFormateur(req, res) {
        const quiz = await quizRepo.getCoursQuizByFormateurId(req.session.formateur_id);
        res.render('quiz/list', { quiz });
    }

    // --- CRÉATION (POST) ---
    async createQuiz(req, res) {
        const { module_id, titre_quiz, description_quiz, score_minimum, questions } = req.body;

        try {
            // Insertion du Quiz
            const quizId = await quizRepo.insert({
                module_id,
                titre: titre_quiz,
                description: description_quiz,
                score_minimum
            });

            // Insertion des questions en boucle
            if (questions && Array.isArray(questions)) {
                for (const q of questions) {
                    await questionRepo.insert({
                        quiz_id: quizId,
                        texte: q.texte,
                        reponse_correcte: q.reponse_correcte,
                        reponse_incorrecte_1: q.reponse_incorrecte_1,
                        reponse_incorrecte_2: q.reponse_incorrecte_2,
                        reponse_incorrecte_3: q.reponse_incorrecte_3
                    });
                }
            }

            res.redirect('/quiz/formateur');
        } catch (error) {
            res.status(500).send("Erreur lors de la création du quiz.");
        }
    }

    // --- ÉDITION (POST) ---
    async updateQuiz(req, res) {
        const quizId = parseInt(req.params.id);
        const { module_id, titre_quiz, description_quiz, score_minimum, questions } = req.body;

        try {
            // Mise à jour du Quiz
            await quizRepo.update(quizId, {
                module_id,
                titre: titre_quiz,
                description: description_quiz,
                score_minimum
            });

            // On vide les anciennes questions et on réinsère les nouvelles (Logique identique au PHP)
            await questionRepo.deleteByQuizId(quizId);

            if (questions && Array.isArray(questions)) {
                for (const q of questions) {
                    await questionRepo.insert({
                        quiz_id: quizId,
                        texte: q.texte,
                        reponse_correcte: q.reponse_correcte,
                        reponse_incorrecte_1: q.reponse_incorrecte_1,
                        reponse_incorrecte_2: q.reponse_incorrecte_2,
                        reponse_incorrecte_3: q.reponse_incorrecte_3
                    });
                }
            }

            res.redirect('/quiz/formateur');
        } catch (error) {
            res.status(500).send("Erreur lors de la modification.");
        }
    }

    // --- SUPPRESSION ---
    async deleteQuiz(req, res) {
        try {
            await quizRepo.delete(req.params.id);
            res.redirect('/quiz/formateur');
        } catch (error) {
            res.status(500).send("Erreur suppression.");
        }
    }
}

module.exports = new QuizController();
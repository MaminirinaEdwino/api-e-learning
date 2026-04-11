const quizRepo = require('../repositories/quizRepositories');
const questionRepo = require('../repositories/questionRepositories');
const inscriptionRepo = require('../repositories/inscriptionRepositories');
const coursRepo = require('../repositories/coursRepositories');
const moduleRepo = require('../repositories/moduleRepositories');

class QuizController {

    // --- LISTE FORMATEUR ---
    async listByFormateur(req, res) {
        const quiz = await quizRepo.getCoursQuizByFormateurId(req.user.id);
        res.json({ quiz });
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

            res.json({
                message: "quiz created",
                quiz: {
                    module_id,
                    titre: titre_quiz,
                    description: description_quiz,
                    score_minimum: score_minimum,
                    questions: questions
                }
            });
        } catch (error) {
            res.status(500).send("Erreur lors de la création du quiz."+error);
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

            res.json({
                module_id,
                titre: titre_quiz,
                description: description_quiz,
                score_minimum,
                questions
            });
        } catch (error) {
            res.status(500).send("Erreur lors de la modification.");
        }
    }

    // --- SUPPRESSION ---
    async deleteQuiz(req, res) {
        try {
            await quizRepo.delete(req.params.id);
            res.json({
                message: "quiz deleted"
            });
        } catch (error) {
            res.status(500).send("Erreur suppression.");
        }
    }
}

module.exports = new QuizController();
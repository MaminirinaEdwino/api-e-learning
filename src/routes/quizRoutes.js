const express = require('express');
const router = express.Router();
const quizCtrl = require('../controllers/quizController');

// Middlewares
const isFormateur = (req, res, next) => {
    if (req.session.formateur_id) return next();
    res.redirect('/admin/login');
};

const isApprenant = (req, res, next) => {
    if (req.session.user_id) return next();
    res.redirect('/connexion');
};

// Routes Apprenant
router.get('/cours/quiz/apprenant/:id', isApprenant, quizCtrl.renderTakeQuiz);

// Routes Formateur
router.get('/quiz/formateur', isFormateur, quizCtrl.listByFormateur);
router.get('/quiz/formateur/delete/:id', isFormateur, quizCtrl.deleteQuiz);

router.get('/quiz/new', isFormateur, async (req, res) => {
    const cours = await coursRepo.getCoursByFormateur(req.session.formateur_id);
    res.render('quiz/create', { cours });
});

router.post('/quiz/new', isFormateur, quizCtrl.createQuiz);

router.get('/quiz/edit/:id', isFormateur, async (req, res) => {
    const quizId = req.params.id;
    const fId = req.session.formateur_id;
    
    const quiz = await quizRepo.getQuizByIdFormateurId(quizId, fId);
    const questions = await questionRepo.getByQuizId(quizId);
    const cours = await coursRepo.getCoursByFormateur(fId);
    const modules = await moduleRepo.getByCoursId(quiz.cours_id);

    res.render('quiz/edit', { quiz_id: quizId, quiz, questions, cours, module: modules });
});

router.post('/quiz/edit/:id', isFormateur, quizCtrl.updateQuiz);

module.exports = router;
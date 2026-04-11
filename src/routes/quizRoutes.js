const express = require('express');
const router = express.Router();
const quizCtrl = require('../controllers/quizController');
const verifyToken = require('../middlewares/authMiddleware');
// Middlewares
const isFormateur = (req, res, next) => {
    if (req.user.role == "formateur") return next();
    res.json({
        message: "Not authenticated"
    });
};



// Routes Formateur
router.get('/quiz/formateur',verifyToken, isFormateur, quizCtrl.listByFormateur);
router.delete('/quiz/formateur/delete/:id',verifyToken,  isFormateur, quizCtrl.deleteQuiz);
router.post('/quiz/new', verifyToken,isFormateur, quizCtrl.createQuiz);
router.put('/quiz/edit/:id', verifyToken,isFormateur, quizCtrl.updateQuiz);

module.exports = router;
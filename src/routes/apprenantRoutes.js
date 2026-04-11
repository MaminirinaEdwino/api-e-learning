const express = require('express');
const router = express.Router();
const apprenantCtrl = require('../controllers/apprenantController');
const verifyToken = require('../middlewares/authMiddleware');
// Middleware simple pour vérifier la session apprenant
const isApprenant = (req, res, next) => {
    if (req.user && req.user.role === 'apprenant') {
        return next();
    }
    res.redirect('/connexion');
};

router.get('/espace/apprenant', verifyToken, isApprenant, apprenantCtrl.dashboard);
// router.get('/espace/apprenant/progression',verifyToken, isApprenant, apprenantCtrl.progression);
router.get('/espace/apprenant/cours',verifyToken, isApprenant, apprenantCtrl.mesCours);
router.post('/enroll/cours', verifyToken,isApprenant, apprenantCtrl.enroll);

module.exports = router;
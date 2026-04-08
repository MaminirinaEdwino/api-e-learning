const express = require('express');
const router = express.Router();
const apprenantCtrl = require('../controllers/apprenantController');

// Middleware simple pour vérifier la session apprenant
const isApprenant = (req, res, next) => {
    if (req.session.logged_in && req.session.user_type === 'apprenant') {
        return next();
    }
    res.redirect('/connexion');
};

router.get('/espace/apprenant', isApprenant, apprenantCtrl.dashboard);
router.get('/espace/apprenant/progression', isApprenant, apprenantCtrl.progression);
router.get('/espace/apprenant/cours', isApprenant, apprenantCtrl.mesCours);
router.post('/enroll/cours', isApprenant, apprenantCtrl.enroll);

module.exports = router;
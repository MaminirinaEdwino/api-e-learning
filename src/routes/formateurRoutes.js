const express = require('express');
const router = express.Router();
const formateurCtrl = require('../controllers/formateurController');

// Middleware de vérification du rôle formateur
const isFormateur = (req, res, next) => {
    if (req.session.user_role === 'formateur' && req.session.formateur_id) {
        return next();
    }
    res.redirect('/admin/login');
};

router.get('/espace/formateur', isFormateur, formateurCtrl.dashboard);
router.get('/espace/formateur/progression', isFormateur, formateurCtrl.progressionApprenant);

module.exports = router;
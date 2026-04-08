const express = require('express');
const router = express.Router();
const moduleCtrl = require('../controllers/moduleController');

// Middlewares de protection
const isFormateur = (req, res, next) => {
    if (req.session.user_role === 'formateur') return next();
    res.redirect('/admin/login');
};

const isApprenant = (req, res, next) => {
    if (req.session.logged_in) return next();
    res.status(401).json({ success: false, message: 'Non connecté' });
};

// Routes standard (Formateur)
router.get('/module/edit/:id', isFormateur, moduleCtrl.renderEdit);
router.post('/module/edit/:id', isFormateur, moduleCtrl.updateModule);
router.get('/module/delete/:id', isFormateur, moduleCtrl.deleteModule);

// Routes API (Apprenant / Dynamique)
router.get('/module/cours/:id', moduleCtrl.getModulesByCours);
router.post('/module/complete/', isApprenant, moduleCtrl.toggleCompletion);

module.exports = router;
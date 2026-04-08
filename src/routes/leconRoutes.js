const express = require('express');
const router = express.Router();
const multer = require('multer');
const leconCtrl = require('../controllers/leconController');

// Configuration de Multer (Stockage en mémoire pour traitement avant écriture)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware de sécurité (Seul le formateur peut modifier ses leçons)
const isFormateur = (req, res, next) => {
    if (req.session.user_role === 'formateur') return next();
    res.redirect('/admin/login');
};

// Routes
router.get('/lecon/edit/:id', isFormateur, leconCtrl.renderEdit);

// 'fichier' correspond au nom du champ input HTML <input type="file" name="fichier">
router.post('/lecon/edit/:id', isFormateur, upload.single('fichier'), leconCtrl.updateLecon);

router.get('/lecon/delete/:id', isFormateur, leconCtrl.deleteLecon);

module.exports = router;
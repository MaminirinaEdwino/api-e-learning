const express = require('express');
const router = express.Router();
const multer = require('multer');
const coursCtrl = require('../controllers/coursController');

// Configuration Multer pour la mémoire (plus simple pour traiter les fichiers ensuite)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware de sécurité
const isFormateur = (req, res, next) => {
    if (req.session.user_role === 'formateur') return next();
    res.redirect('/admin/login');
};

// Routes
router.get('/cours/new', isFormateur, async (req, res) => {
    const formations = await formationRepo.getAllByNom();
    res.render('cours/create', { formations });
});

// "any()" est utilisé ici car les noms des fichiers sont dynamiques (tableaux de modules)
router.post('/cours/new', isFormateur, upload.any(), coursCtrl.createCours);

router.get('/cours/formateur', isFormateur, coursCtrl.listForFormateur);
router.get('/cours/delete/:id', isFormateur, coursCtrl.deleteCours);

module.exports = router;
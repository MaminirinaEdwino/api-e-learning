const express = require('express');
const router = express.Router();
const multer = require('multer');
const coursCtrl = require('../controllers/coursController');
const verifyToken = require('../middlewares/authMiddleware')

// Configuration Multer pour la mémoire (plus simple pour traiter les fichiers ensuite)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware de sécurité
const isFormateur = (req, res, next) => {
    if (req.user.role === 'formateur' && req.user) return next();
    res.json({
        message: "Unauthorized"
    });
};

// Routes
router.get('/cours/new', verifyToken,isFormateur, async (req, res) => {
    const formations = await formationRepo.getAllByNom();
    res.render('cours/create', { formations });
});

// "any()" est utilisé ici car les noms des fichiers sont dynamiques (tableaux de modules)
router.post('/cours/new', verifyToken,isFormateur, upload.any(), coursCtrl.createCours);

router.get('/cours/formateur',verifyToken, isFormateur, coursCtrl.listForFormateur);
router.get('/cours/delete/:id',verifyToken,  isFormateur, coursCtrl.deleteCours);

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const leconCtrl = require('../controllers/leconController');
const verifyToken = require('../middlewares/authMiddleware');
// Configuration de Multer (Stockage en mémoire pour traitement avant écriture)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware de sécurité (Seul le formateur peut modifier ses leçons)
const isFormateur = (req, res, next) => {
    if (req.user.role === 'formateur') return next();
    res.json({
        message: "Unauthorized"
    });
};
const isLogged = (req, res, next) => {
    if (req.user) return next();
    res.json({
        message: "Unauthorized"
    });
};
// 'fichier' correspond au nom du champ input HTML <input type="file" name="fichier">
router.put('/lecon/edit/:id', verifyToken, isFormateur, upload.single('fichier'), leconCtrl.updateLecon);
router.get('/lecon', verifyToken, isLogged, leconCtrl.getAll)
router.delete('/lecon/delete/:id', verifyToken, isFormateur, leconCtrl.deleteLecon);

module.exports = router;
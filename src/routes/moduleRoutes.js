const express = require('express');
const router = express.Router();
const moduleCtrl = require('../controllers/moduleController');
const verifyToken = require('../middlewares/authMiddleware');

// Middlewares de protection
const isFormateur = (req, res, next) => {
    if (req.user.role == 'formateur') return next();
    res.status(401).json({ success: false, message: 'Non autorisé' });
};

const isApprenant = (req, res, next) => {
    if (req.user) return next();
    res.status(401).json({ success: false, message: 'Non connecté' });
};

router.put('/module/edit/:id', verifyToken, isFormateur, moduleCtrl.updateModule);
router.delete('/module/delete/:id', verifyToken, isFormateur, moduleCtrl.deleteModule);
router.post('/module/new', verifyToken, isFormateur, moduleCtrl.create)
// Routes API (Apprenant / Dynamique)
router.get('/module/cours/:id', moduleCtrl.getModulesByCours);
router.get('/module/', verifyToken, isApprenant, moduleCtrl.getAll)
router.post('/module/complete/', verifyToken, isApprenant, moduleCtrl.toggleCompletion);

module.exports = router;
const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const verifyToken = require('../middlewares/authMiddleware');

const isAdmin = (req, res, next) => {
    // 1. On vérifie si req.user existe (donc si le token a été validé avant)
    // 2. On vérifie si le rôle à l'intérieur du token est 'admin'
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    console.log(req.user)
    // Si l'utilisateur n'est pas admin, on renvoie une erreur 403 (Forbidden)
    res.status(403).json({
        status: "failed",
        message: "Accès refusé : Droits administrateur requis."
    });
};


router.post('/admin/login', adminCtrl.loginAction);
router.get('/admin/backoffice', verifyToken, isAdmin, adminCtrl.backoffice);
router.get('/admin/gestionuser', verifyToken, isAdmin, adminCtrl.gestionUser);
router.get('/export/csv', isAdmin, adminCtrl.exportCsv);
router.post('/send/code', isAdmin, adminCtrl.sendCode);
router.post('/espace/certificat', adminCtrl.generateCertificate);

module.exports = router;
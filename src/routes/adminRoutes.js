const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');

// Middleware de sécurité
const isAdmin = (req, res, next) => {
    console.log(req.session)
    if (req.session.user_role === 'admin') return next();
    res.json({
        status: "failed",
        message: "Unauthorized"
    })
};

router.post('/admin/login', adminCtrl.loginAction);
router.get('/admin/backoffice', isAdmin,adminCtrl.backoffice);
router.get('/admin/gestionuser', isAdmin, adminCtrl.gestionUser);
router.get('/export/csv',  adminCtrl.exportCsv);
router.post('/send/code', isAdmin, adminCtrl.sendCode);
router.post('/espace/certificat', isAdmin, adminCtrl.generateCertificate);

module.exports = router;
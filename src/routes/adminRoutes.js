const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');

// Middleware de sécurité
const isAdmin = (req, res, next) => {
    if (req.session.user_role === 'admin') return next();
    res.redirect('/admin/login');
};

router.get('/admin/login', adminCtrl.loginPage);
router.post('/admin/login', adminCtrl.loginAction);

router.get('/admin/backoffice', isAdmin, adminCtrl.backoffice);
router.get('/admin/gestionuser', isAdmin, adminCtrl.gestionuser);
router.get('/export/csv', isAdmin, adminCtrl.exportCsv);
router.post('/send/code', isAdmin, adminCtrl.sendCode);
router.post('/espace/certificat', isAdmin, adminCtrl.generateCertificate);

module.exports = router;
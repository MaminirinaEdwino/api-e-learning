const express = require('express');
const router = express.Router();
const userAdminCtrl = require('../controllers/userAdminController');

// Middleware pour restreindre l'accès aux administrateurs
const isAdmin = (req, res, next) => {
    if (req.session.logged_in && req.session.user_role === 'admin') {
        return next();
    }
    res.redirect('/admin/login');
};

// Routes de gestion des comptes
router.post('/user/deactivate', isAdmin, userAdminCtrl.deactivate);
router.post('/user/activate/:id', isAdmin, userAdminCtrl.toggleStatus);
router.get('/user/delete/:id', isAdmin, userAdminCtrl.deleteUser);

module.exports = router;
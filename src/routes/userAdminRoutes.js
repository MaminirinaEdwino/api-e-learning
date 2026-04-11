const express = require('express');
const router = express.Router();
const userAdminCtrl = require('../controllers/userAdminController');
const verifyToken = require('../middlewares/authMiddleware');
// Middleware pour restreindre l'accès aux administrateurs
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.json({
        message:"Not authenticated"
    });
};

// Routes de gestion des comptes
router.post('/user/deactivate',verifyToken, isAdmin, userAdminCtrl.deactivate);
router.post('/user/activate/:id',verifyToken, isAdmin, userAdminCtrl.toggleStatus);
router.delete('/user/delete/:id',verifyToken, isAdmin, userAdminCtrl.deleteUser);

module.exports = router;
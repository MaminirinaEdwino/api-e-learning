const express = require('express');
const router = express.Router();
const adminForumCtrl = require('../controllers/adminForumController');
const verifyToken = require('../middlewares/authMiddleware');

// Middleware de protection Admin
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
// Routes
router.get('/gestion/forum', verifyToken, isAdmin, adminForumCtrl.listGestion);
router.post('/forum/delete/:id', verifyToken, isAdmin, adminForumCtrl.deleteForum);
router.post('/forum/edit', isAdmin, verifyToken, adminForumCtrl.updateForum);
router.get('/gestion/forum/message/:id', verifyToken, isAdmin, adminForumCtrl.viewMessages);

module.exports = router;

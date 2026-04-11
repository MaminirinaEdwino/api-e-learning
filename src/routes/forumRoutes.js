const express = require('express');
const router = express.Router();
const forumCtrl = require('../controllers/forumController');
const verifyToken = require('../middlewares/authMiddleware');
// Middlewares de protection
const isFormateur = (req, res, next) => {
    if (req.user.role === 'formateur') return next();
    res.json({
        "message": "Unauthorized"
    });
};

const isLogged = (req, res, next) => {
    if (req.user) return next();
    res.json({
        "message": "Unauthorized"
    });
};

// Routes
router.post('/forum/new', verifyToken, isLogged, forumCtrl.createForum);
router.get('/forum/cours/:id', verifyToken, isFormateur, forumCtrl.listForumsByCours);
router.get('/espace/apprenant/forum/:id', verifyToken, isLogged, forumCtrl.showForumApprenant);

module.exports = router;
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postController');
const verifyToken = require('../middlewares/authMiddleware');
// Middleware d'authentification simple
const isAuthenticated = (req, res, next) => {
    if (req.user.id) {
        return next();
    }
    res.json({
        message: "Not authenticated"
    });
};

// Route POST pour la création de message
router.post('/post/new', verifyToken, isAuthenticated, postCtrl.createPost);
module.exports = router;
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postController');

// Middleware d'authentification simple
const isAuthenticated = (req, res, next) => {
    if (req.session.user_id || req.session.formateur_id) {
        return next();
    }
    res.redirect('/connexion');
};

// Route POST pour la création de message
router.post('/post/new', isAuthenticated, postCtrl.createPost);

module.exports = router;
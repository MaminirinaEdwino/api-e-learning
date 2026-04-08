const express = require('express');
const router = express.Router();
const forumCtrl = require('../controllers/forumController');

// Middlewares de protection
const isFormateur = (req, res, next) => {
    if (req.session.user_role === 'formateur') return next();
    res.redirect('/admin/login');
};

const isLogged = (req, res, next) => {
    if (req.session.logged_in || req.session.formateur_id) return next();
    res.redirect('/connexion');
};

// Routes
router.post('/forum/new', isLogged, forumCtrl.createForum);
router.get('/forum/cours/:id', isFormateur, forumCtrl.listForumsByCours);
router.get('/espace/apprenant/forum/:id', isLogged, forumCtrl.showForumApprenant);

module.exports = router;
const express = require('express');
const router = express.Router();
const adminForumCtrl = require('../controllers/adminForumController');

// Middleware de protection Admin
const isAdmin = (req, res, next) => {
    if (req.session.logged_in && req.session.user_role === 'admin') {
        return next();
    }
    res.redirect('/admin/login');
};

// Routes
router.get('/gestion/forum', isAdmin, adminForumCtrl.listGestion);
router.post('/forum/delete/:id', isAdmin, adminForumCtrl.deleteForum);
router.post('/forum/edit', isAdmin, adminForumCtrl.updateForum);
router.get('/gestion/forum/message/:id', isAdmin, adminForumCtrl.viewMessages);

module.exports = router;

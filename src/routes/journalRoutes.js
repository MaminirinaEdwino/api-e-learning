const express = require('express');
const router = express.Router();
const journalCtrl = require('../controllers/journalController');

// Middleware de protection (Admin uniquement pour le journal)
const isAdmin = (req, res, next) => {
    if (req.session.logged_in && req.session.user_role === 'admin') {
        return next();
    }
    res.redirect('/admin/login');
};

// Routes
router.post('/notification/read', isAdmin, journalCtrl.markNotificationsRead);
router.get('/journal', isAdmin, journalCtrl.listLogs);
router.post('/journal/delete/:id', isAdmin, journalCtrl.deleteLog);

module.exports = router;
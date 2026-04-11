const express = require('express');
const router = express.Router();
const journalCtrl = require('../controllers/journalController');
const verifyToken = require('../middlewares/authMiddleware');
// Middleware de protection (Admin uniquement pour le journal)
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.json({
        message: "Unauthorized"
    });
};

// Routes
router.post('/notification/read', verifyToken,isAdmin, journalCtrl.markNotificationsRead);
router.get('/journal', verifyToken,isAdmin, journalCtrl.listLogs);
router.post('/journal/delete/:id', verifyToken,isAdmin, journalCtrl.deleteLog);

module.exports = router;
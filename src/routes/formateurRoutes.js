const express = require('express');
const router = express.Router();
const formateurCtrl = require('../controllers/formateurController');
const verifyToken = require('../middlewares/authMiddleware');
// Middleware de vérification du rôle formateur
const isFormateur = (req, res, next) => {
    if (req.user.role == 'formateur' && req.user) {
        return next();
    }
    res.json({
        "message": "Unauthorized"
    });
};

router.get('/espace/formateur', verifyToken,isFormateur, formateurCtrl.dashboard);
router.get('/espace/formateur/progression', verifyToken,isFormateur, formateurCtrl.progressionApprenant);

module.exports = router;
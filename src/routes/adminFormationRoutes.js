const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminFormationController');
const verifyToken = require('../middlewares/authMiddleware');

// Middleware de protection Admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.json({
        message: "Unauthorized"
    });
};


// Routes de navigation
router.get('/gestion/formation', verifyToken, isAdmin, adminCtrl.listGestion);

router.get('/gestion/formation/:id', verifyToken, isAdmin, async (req, res) => {
    const formation = await formationRepo.getById(req.params.id);
    const sousFormations = await contenuRepo.getSousFormationAsJson(req.params.id);
    res.json({
        id: req.params.id,
        formation_details: formation,
        sous_formations: sousFormations
    });
});

// Routes d'action (POST)
router.post('/formation/new', verifyToken, isAdmin, adminCtrl.createFormation);
router.post('/sousformation/new', verifyToken, isAdmin, adminCtrl.createSousFormation);
router.post('/formation/edit/:id', verifyToken, isAdmin, adminCtrl.updateFormation);

// Routes de suppression
router.get('/formation/delete/:id', verifyToken, isAdmin, async (req, res) => {
    await formationRepo.delete(req.params.id);
    res.json({
        success: true,
        message: "Formation deleted"
    });
});

router.get('/contenu/delete/:id', verifyToken, isAdmin, adminCtrl.deleteContenu);

module.exports = router;
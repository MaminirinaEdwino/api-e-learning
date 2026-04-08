const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminFormationController');

// Middleware de protection Admin
const isAdmin = (req, res, next) => {
    if (req.session.logged_in && req.session.user_role === 'admin') {
        return next();
    }
    res.redirect('/admin/login');
};

// Routes de navigation
router.get('/gestion/formation', isAdmin, adminCtrl.listGestion);

router.get('/gestion/formation/:id', isAdmin, async (req, res) => {
    const formation = await formationRepo.getById(req.params.id);
    const sousFormations = await contenuRepo.getSousFormationAsJson(req.params.id);
    res.render('admin/voirDetailsFormation', { 
        id: req.params.id, 
        formation_details: formation, 
        sous_formations: sousFormations 
    });
});

// Routes d'action (POST)
router.post('/formation/new', isAdmin, adminCtrl.createFormation);
router.post('/sousformation/new', isAdmin, adminCtrl.createSousFormation);
router.post('/formation/edit/:id', isAdmin, adminCtrl.updateFormation);

// Routes de suppression
router.get('/formation/delete/:id', isAdmin, async (req, res) => {
    await formationRepo.delete(req.params.id);
    res.redirect('/gestion/formation');
});

router.get('/contenu/delete/:id', isAdmin, adminCtrl.deleteContenu);

module.exports = router;
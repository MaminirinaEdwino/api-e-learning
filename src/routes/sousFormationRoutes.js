const express = require('express');
const router = express.Router();
const sousFormationCtrl = require('../controllers/sousFormationController');

// Route dynamique pour récupérer les sous-formations par ID de parent
router.get('/sousformation/:id', (req, res) => sousFormationCtrl.getByFormation(req, res));

module.exports = router;
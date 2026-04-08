const express = require('express');
const router = express.Router();
const formationCtrl = require('../controllers/formationController');

// Route GET pour le catalogue
router.get('/formation/catalogue', (req, res) => formationCtrl.catalogue(req, res));

module.exports = router;

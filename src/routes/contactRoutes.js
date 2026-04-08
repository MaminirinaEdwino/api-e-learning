const express = require('express');
const router = express.Router();
const contactCtrl = require('../controllers/contactController');

// Route POST pour le formulaire
router.post('/apropos/contact', contactCtrl.sendContactEmail);

module.exports = router;
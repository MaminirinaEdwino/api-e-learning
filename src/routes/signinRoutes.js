const express = require('express');
const router = express.Router();
const multer = require('multer');
const signinCtrl = require('../controllers/signinController');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo
});

// Apprenant
router.get('/signin/apprenant', (req, res) => res.render('signin/apprenant'));
router.post('/signin/apprenant', upload.single('photo'), signinCtrl.signupApprenant);
router.get('/merci', (req, res) => res.render('signin/merci'));

// Formateur (Activation)
router.get('/signin/formateur', (req, res) => res.render('signin/formateur'));
router.post('/signin/formateur', signinCtrl.confirmFormateur);

// Formateur (Postuler)
router.get('/signin/postuler', (req, res) => res.render('signin/postulerformateur'));
router.post('/signin/postuler', upload.single('cv'), signinCtrl.postulerFormateur);

module.exports = router;
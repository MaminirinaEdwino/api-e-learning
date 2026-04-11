const express = require('express');
const router = express.Router();
const multer = require('multer');
const signinCtrl = require('../controllers/signinController');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo
});

// Apprenant
router.post('/signin/apprenant', upload.single('photo'), signinCtrl.signupApprenant);

router.post('/signin/formateur', signinCtrl.confirmFormateur);

// Formateur (Postuler)
router.post('/signin/postuler', upload.single('cv'), signinCtrl.postulerFormateur);

module.exports = router;
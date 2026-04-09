const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.get('/logout', authCtrl.logout);
router.post('/auth', authCtrl.loginAction.bind(authCtrl)); // .bind pour garder le contexte du 'this'

// Route d'inscription (à lier à votre contrôleur d'inscription)
router.get('/inscription', (req, res) => res.render('authentication/inscription'));

module.exports = router;
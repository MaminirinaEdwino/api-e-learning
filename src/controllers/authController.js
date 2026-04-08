const bcrypt = require('bcrypt');
const utilisateurRepo = require('../repositories/utilisateurRepository');
const formateurRepo = require('../repositories/formateurRepository');

class AuthController {
    // Affiche la page de connexion
    renderLogin(req, res) {
        res.render('authentication/connexion', { 
            error: req.session.error, 
            success: req.session.success 
        });
        // Nettoyage après affichage (Flash messages)
        delete req.session.error;
        delete req.session.success;
    }

    // Déconnexion
    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/connexion');
        });
    }

    // Traitement de l'authentification (POST)
    async loginAction(req, res) {
        const { email, password } = req.body;
        const maxAttempts = 5;
        const lockoutTime = 15 * 60 * 1000; // 15 minutes en ms

        // 1. Validation de base
        if (!email || !password) {
            req.session.error = "Veuillez remplir tous les champs.";
            return res.redirect('/connexion');
        }

        // 2. Vérification Force Brute (Lockout)
        if (!req.session.login_attempts) req.session.login_attempts = {};
        const attempts = req.session.login_attempts[email];

        if (attempts && attempts.count >= maxAttempts) {
            const timePassed = Date.now() - attempts.time;
            if (timePassed < lockoutTime) {
                const minutesLeft = Math.ceil((lockoutTime - timePassed) / 60000);
                req.session.error = `Trop de tentatives. Réessayez dans ${minutesLeft} minutes.`;
                return res.redirect('/connexion');
            } else {
                delete req.session.login_attempts[email];
            }
        }

        try {
            // 3. Tentative de trouver un FORMATEUR d'abord
            const formateur = await formateurRepo.getForAuth(email);
            if (formateur) {
                const match = await bcrypt.compare(password, formateur.password);
                if (match) {
                    this.initSession(req, 'formateur', formateur);
                    return res.redirect('/espace/formateur');
                }
            }

            // 4. Tentative de trouver un APPRENANT
            const user = await utilisateurRepo.findByEmail(email);
            if (user) {
                // Vérification si le compte est actif
                if (!user.actif) {
                    req.session.error = "Votre compte est désactivé. Contactez l'administrateur.";
                    return res.redirect('/connexion');
                }

                const match = await bcrypt.compare(password, user.mot_de_passe);
                if (match) {
                    // Succès : réinitialisation des tentatives
                    delete req.session.login_attempts[email];
                    this.initSession(req, 'apprenant', user);
                    return res.redirect('/espace/apprenant');
                }
            }

            // 5. Gestion de l'échec (Mot de passe faux ou Email inconnu)
            if (!req.session.login_attempts[email]) {
                req.session.login_attempts[email] = { count: 0, time: Date.now() };
            }
            req.session.login_attempts[email].count++;
            req.session.login_attempts[email].time = Date.now();

            const remaining = maxAttempts - req.session.login_attempts[email].count;
            req.session.error = `Identifiants incorrects. Tentatives restantes : ${remaining}`;
            res.redirect('/connexion');

        } catch (error) {
            console.error("Auth Error:", error);
            req.session.error = "Une erreur serveur est survenue.";
            res.redirect('/connexion');
        }
    }

    // Helper pour initialiser la session selon le rôle
    initSession(req, type, data) {
        req.session.logged_in = true;
        req.session.user_type = type;
        
        if (type === 'formateur') {
            req.session.formateur_id = data.id;
            req.session.formateur_nom_prenom = data.nom_prenom;
            req.session.user_role = "formateur";
        } else {
            req.session.user_id = data.id;
            req.session.user_nom = data.nom;
        }
        req.session.success = `Bienvenue, ${data.nom_prenom || data.nom} !`;
    }
}

module.exports = new AuthController();
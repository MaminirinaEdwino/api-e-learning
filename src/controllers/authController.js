const bcrypt = require('bcrypt');
const utilisateurRepo = require('../repositories/utilisateurRepositories');
const formateurRepo = require('../repositories/formateurRepositories');

class AuthController {
    // Déconnexion (JSON)
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erreur lors de la déconnexion." });
            }
            res.json({ success: true, message: "Déconnexion réussie." });
        });
    }

    // Traitement de l'authentification (POST JSON)
    async loginAction(req, res) {
        const { email, password } = req.body;
        const maxAttempts = 5;
        const lockoutTime = 15 * 60 * 1000; // 15 minutes

        // 1. Validation de base
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Veuillez remplir tous les champs." 
            });
        }

        // 2. Vérification Force Brute (Lockout)
        if (!req.session.login_attempts) req.session.login_attempts = {};
        const attempts = req.session.login_attempts[email];

        if (attempts && attempts.count >= maxAttempts) {
            const timePassed = Date.now() - attempts.time;
            if (timePassed < lockoutTime) {
                const minutesLeft = Math.ceil((lockoutTime - timePassed) / 60000);
                return res.status(429).json({ 
                    success: false, 
                    message: `Trop de tentatives. Réessayez dans ${minutesLeft} minutes.` 
                });
            } else {
                delete req.session.login_attempts[email];
            }
        }

        try {
            // 3. Tentative FORMATEUR
            const formateur = await formateurRepo.getForAuth(email);
            if (formateur) {
                const dbHash = formateur.password.replace(/^\$2y\$/, "$2a$");
                const match = await bcrypt.compare(password,dbHash);
                if (match) {
                    delete req.session.login_attempts[email];
                    const sessionData = this.initSession(req, 'formateur', formateur);
                    return res.json({ 
                        success: true, 
                        message: "Connexion réussie (Formateur).",
                        user: sessionData 
                    });
                }
            }

            // 4. Tentative APPRENANT
            const user = await utilisateurRepo.findByEmail(email);
            if (user) {
                if (!user.dataValues.actif) {
                    return res.status(403).json({ 
                        success: user.actif, 
                        message: "Votre compte est désactivé. Contactez l'administrateur." 
                    });
                }
                const dbHash = user.dataValues.mot_de_passe.replace(/^\$2y\$/, "$2a$");

                const match = await bcrypt.compare(password, dbHash);
                console.log("match", user.dataValues.mot_de_passe, password)
                if (match) {
                    delete req.session.login_attempts[email];
                    const sessionData = this.initSession(req, 'apprenant', user);
                    return res.json({ 
                        success: true, 
                        message: "Connexion réussie (Apprenant).",
                        user: sessionData 
                    });
                }
            }

            // 5. Gestion de l'échec
            if (!req.session.login_attempts[email]) {
                req.session.login_attempts[email] = { count: 0, time: Date.now() };
            }
            req.session.login_attempts[email].count++;
            req.session.login_attempts[email].time = Date.now();

            const remaining = maxAttempts - req.session.login_attempts[email].count;
            
            return res.status(401).json({ 
                success: false, 
                message: "Identifiants incorrects.",
                attemptsRemaining: remaining > 0 ? remaining : 0
            });

        } catch (error) {
            console.error("Auth Error:", error);
            res.status(500).json({ 
                success: false, 
                message: "Une erreur serveur est survenue." 
            });
        }
    }

    // Helper pour initialiser la session et retourner les données publiques
   
}

module.exports = new AuthController();
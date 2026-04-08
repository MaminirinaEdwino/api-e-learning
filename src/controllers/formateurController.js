const coursRepo = require('../repositories/coursRepositories');
const forumMessageRepo = require('../repositories/forumMessageRepositories');
const moduleRepo = require('../repositories/moduleRepositories');
const inscriptionRepo = require('../repositories/inscriptionRepositories');
const resultatQuizRepo = require('../repositories/resultatQuizRepositories');

class FormateurController {

    /**
     * Dashboard du formateur : Statistiques et Notifications
     */
    async dashboard(req, res) {
        const formateurId = req.session.formateur_id;

        try {
            // Récupération des données de base
            const totalCours = await coursRepo.getCoursCount(formateurId);
            const ventes = await coursRepo.getVente(formateurId);
            const apprenantsRaw = await coursRepo.getApprenant(formateurId);
            const notifications = await forumMessageRepo.getNotifications(formateurId);

            // Transformation des données pour la progression (Logique PHP convertie)
            const progression = {};
            apprenantsRaw.forEach(a => {
                if (!progression[a.id]) {
                    progression[a.id] = { titre: a.titre, apprenants: {} };
                }

                const totalModules = a.total_modules || 0;
                const modulesTermines = a.modules_termines || 0;
                
                progression[a.id].apprenants[a.utilisateur_id] = {
                    nom: a.utilisateur_nom,
                    progression: totalModules > 0 ? (modulesTermines / totalModules) * 100 : 0
                };
            });

            res.render('espaceformateur/espaceformateur', {
                total_cours: totalCours,
                ventes: ventes,
                apprenants: apprenantsRaw,
                notifications: notifications,
                progression: progression
            });

        } catch (error) {
            console.error("Erreur Dashboard Formateur:", error);
            res.status(500).send("Erreur lors du chargement du tableau de bord.");
        }
    }

    /**
     * Détails de la progression des apprenants par cours
     */
    async progressionApprenant(req, res) {
        const formateurId = req.session.formateur_id;

        try {
            const cours = await coursRepo.getCoursByFormateur(formateurId);
            const progression = {};

            // Utilisation de Promise.all pour des performances optimales (exécutions parallèles)
            await Promise.all(cours.map(async (c) => {
                const modules = await moduleRepo.getByCoursId(c.id);
                const totalModules = modules.length;
                const apprenants = await inscriptionRepo.getApprenantByCoursId(c.id);

                progression[c.id] = {
                    titre: c.titre,
                    total_modules: totalModules,
                    apprenants: {}
                };

                // On enrichit chaque apprenant avec ses résultats
                for (const apprenant of apprenants) {
                    const modulesTermines = await moduleRepo.getModuleTermine(apprenant.utilisateur_id, c.id);
                    const resultatsQuiz = await resultatQuizRepo.getByUserIdCoursId(apprenant.utilisateur_id, c.id);

                    progression[c.id].apprenants[apprenant.utilisateur_id] = {
                        nom: apprenant.utilisateur_nom,
                        modules_termines: modulesTermines,
                        progression: totalModules > 0 ? (modulesTermines.length / totalModules) * 100 : 0,
                        resultats_quiz: resultatsQuiz
                    };
                }
            }));

            res.render('espaceformateur/progressionApprenant', {
                cours: cours,
                progression: progression
            });

        } catch (error) {
            console.error("Erreur Progression Apprenant:", error);
            res.status(500).send("Erreur lors du calcul des progressions.");
        }
    }
}

module.exports = new FormateurController();
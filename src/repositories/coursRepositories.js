const { Op, fn, col, literal, QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Cours, Formation, ContenuFormation, Inscription, Module, Completion, User, Quiz, ResultatQuiz } = require('../models/index')

class CoursRepositories {

    // Équivalent de CountCours
    async countAll() {
        return await Cours.count();
    }

    // Équivalent de Insert
    async insert(data) {
        return await Cours.create(data);
    }

    // Équivalent de GetAll
    async getAll() {
        return await Cours.findAll();
    }

    // Équivalent de GetNewCours (Cours créés depuis moins de 24h)
    async getNewCoursCount() {
        return await Cours.count({
            where: {
                created_at: {
                    [Op.gte]: literal('NOW() - INTERVAL 1 DAY')
                }
            }
        });
    }

    // Équivalent de GetById
    async getById(id) {
        return await Cours.findByPk(id);
    }
    async getByUser(userId) {
        try {
            const cours = await Cours.findAll({
                // On sélectionne les colonnes du cours (c.*)
                include: [{
                    model: Inscription,
                    as: 'Inscriptions', // L'alias défini dans ton index.js
                    where: {
                        utilisateur_id: userId,
                        statut_paiement: 'paye'
                    },
                    attributes: [] // On ne veut pas les données de l'inscription, juste filtrer par elle
                }],
                // raw: true permet d'avoir un tableau d'objets simples (équivalent PDO::FETCH_ASSOC)
                raw: true
            });

            return cours;
        } catch (error) {
            console.error("Erreur lors de la récupération des cours de l'utilisateur :", error);
            throw error;
        }
    }

    // Équivalent de Update
    async update(id, data) {
        return await Cours.update(data, { where: { id } });
    }

    // Équivalent de Delete
    async delete(id) {
        return await Cours.destroy({ where: { id } });
    }

    // Équivalent de GetCoursCatalogue (avec LEFT JOIN)
    async getCatalogue() {
        return await Cours.findAll({
            include: [
                { model: Formation, attributes: [['nom_formation', 'nom_theme']] },
                { model: ContenuFormation, attributes: [['sous_formation', 'nom_sous_theme']] }
            ],
            order: [['titre', 'ASC']],
            raw: true, // Pour obtenir un tableau d'objets simple comme en PHP
            nest: true
        });
    }

    // Équivalent de GetCoursProgression (Calcul complexe Quiz)
    // async getCoursProgression(userId) {
    //     // En Node, on utilise souvent une requête brute (Query) pour ce niveau de complexité SQL
    //     // ou on définit des associations complexes. Voici la version via Sequelize :
    //     return await Cours.findAll({
    //         attributes: [
    //             'id', 'titre',
    //             [literal('COUNT(DISTINCT modules->quiz.id)'), 'total_quiz'],
    //             [literal('COUNT(DISTINCT CASE WHEN modules->quiz->resultats_quiz.score >= modules->quiz.score_minimum THEN modules->quiz->resultats_quiz.id END)'), 'quiz_reussis']
    //         ],
    //         include: [{
    //             model: Inscription,
    //             where: { utilisateur_id: userId, statut_paiement: 'paye' },
    //             attributes: []
    //         }, {
    //             model: Module,
    //             include: [{
    //                 model: Quiz,
    //                 include: [{
    //                     model: ResultatQuiz,
    //                     where: { utilisateur_id: userId },
    //                     required: false
    //                 }]
    //             }]
    //         }],
    //         group: ['Cours.id', 'Cours.titre']
    //     });
    // }
    async getCoursProgression(userId) {
        try {
            // 1. Récupérer les inscriptions payées de l'utilisateur
            const inscriptions = await Inscription.findAll({
                where: { utilisateur_id: userId, statut_paiement: 'paye' },
                attributes: ['cours_id'],
                raw: true
            });

            if (inscriptions.length === 0) return [];

            const coursIds = inscriptions.map(ins => ins.cours_id);

            // 2. Récupérer les cours avec leurs modules et quiz associés
            const coursData = await Cours.findAll({
                where: { id: coursIds },
                attributes: ['id', 'titre'],
                include: [{
                    model: Module,
                    as: 'Modules',
                    include: [{
                        model: Quiz,
                        attributes: ['id', 'score_minimum']
                    }]
                }]
            });

            // 3. Récupérer tous les résultats de quiz de cet utilisateur
            const mesResultats = await ResultatQuiz.findAll({
                where: { utilisateur_id: userId },
                attributes: ['quiz_id', 'score'],
                raw: true
            });

            // 4. Procéder au calcul de la progression en JavaScript
            const progression = coursData.map(cours => {
                // On récupère tous les quiz de ce cours via ses modules
                const tousLesQuizDuCours = cours.Modules.flatMap(m => m.Quizs || []);

                const total_quiz = tousLesQuizDuCours.length;

                // On filtre les quiz réussis
                const quiz_reussis = tousLesQuizDuCours.filter(quiz => {
                    const resultat = mesResultats.find(r => r.quiz_id === quiz.id);
                    // Un quiz est réussi si on a un résultat ET que le score est suffisant
                    return resultat && resultat.score >= quiz.score_minimum;
                }).length;

                return {
                    id: cours.id,
                    titre: cours.titre,
                    total_quiz: total_quiz,
                    quiz_reussis: quiz_reussis,
                    pourcentage: total_quiz > 0 ? Math.round((quiz_reussis / total_quiz) * 100) : 0
                };
            });

            return progression;

        } catch (error) {
            console.error("Erreur calcul progression JS :", error);
            throw error;
        }
    }
    // Équivalent de GetVente (Statistiques formateur)
    async getVentesByFormateur(formateur_id) {
        return await Cours.findAll({
            where: { formateur_id },
            attributes: [
                'titre', 'prix',
                [fn('COUNT', col('inscriptions.id')), 'inscriptions'],
                [fn('SUM', col('prix')), 'revenu']
            ],
            include: [{
                model: Inscription,
                where: { statut_paiement: 'paye' },
                required: false,
                attributes: []
            }],
            group: ['Cours.id', 'Cours.titre', 'Cours.prix']
        });
    }

    // Équivalent de GetApprenant (Progression détaillée pour le formateur)
    async getApprenantsProgression(formateur_id) {
        return await Cours.findAll({
            where: { formateur_id },
            include: [{
                model: Inscription,
                where: { statut_paiement: 'paye' },
                include: [{
                    model: User,
                    attributes: ['id', 'nom']
                }]
            }, {
                model: Module,
                include: [{
                    model: Completion,
                    required: false
                }]
            }]
        });
    }

    // Équivalent de GetLastInsertId
    async getLastInsertId(formateur_id) {
        const result = await Cours.findOne({
            where: { formateur_id },
            order: [['id', 'DESC']],
            attributes: ['id']
        });
        return result ? result.id : null;
    }
    async countCours() {
        try {
            const count = await Cours.count();

            return count;
        } catch (error) {
            console.error("Erreur lors du comptage des apprenants :", error);
            throw error;
        }
    }

    async getCoursFormation() {
        try {
            const result = await Cours.findAll({
                // On inclut le modèle Formation (le LEFT JOIN)
                include: [{
                    model: Formation,
                    attributes: ['id_formation'], // On ne prend que l'ID comme dans ton SQL
                    required: false // Force le LEFT JOIN (par défaut Sequelize fait souvent du INNER si non spécifié)
                }],
                // raw: true aplatit les instances Sequelize en objets JSON simples
                // nest: true permet de garder une structure propre, mais pour coller à ton PHP, 
                // on peut traiter le résultat juste après.
                raw: true,
                nest: true
            });

            // Si tu veux exactement le même format plat que PHP (c.* + f.id_formation) :
            return result.map(item => ({
                ...item,
                id_formation: item.Formation ? item.Formation.id_formation : null
            }));

        } catch (error) {
            console.error("Erreur lors de la récupération des cours et formations :", error);
            throw error;
        }
    }
    async getCoursStatus(coursList, userId) {
        try {
            // 1. Extraire tous les IDs de cours de la liste
            const coursIds = coursList.map(c => c.id);

            // 2. Récupérer TOUS les modules pour ces cours en une seule fois
            const allModules = await Module.findAll({
                where: { cours_id: coursIds },
                attributes: ['id', 'cours_id'],
                raw: true
            });

            // 3. Récupérer TOUTES les complétions de l'utilisateur pour ces cours
            const allCompletions = await Completion.findAll({
                where: {
                    utilisateur_id: userId,
                    cours_id: coursIds
                },
                attributes: ['module_id', 'cours_id'],
                raw: true
            });

            const coursStatuts = {};

            // 4. Calculer le statut pour chaque cours en mémoire
            coursList.forEach(course => {
                const courseId = course.id;

                // Filtrer les modules et complétions appartenant à ce cours précis
                const modulesDuCours = allModules.filter(m => m.cours_id === courseId);
                const completionsDuCours = allCompletions.filter(c => c.cours_id === courseId);

                const totalModules = modulesDuCours.length;
                const completedModules = completionsDuCours.length;

                coursStatuts[courseId] = {
                    is_completed: totalModules > 0 && totalModules === completedModules,
                    progress: totalModules > 0 ? (completedModules / totalModules * 100) : 0
                };
            });

            return coursStatuts;
        } catch (error) {
            console.error("Erreur dans getCoursStatus :", error);
            throw error;
        }
    }
    async getCoursFormationContenu(formateurId) {
        try {
            const cours = await Cours.findAll({
                where: { formateur_id: formateurId },
                // On sélectionne les colonnes spécifiques de la table cours
                attributes: ['id', 'titre', 'description', 'prix', 'photo', 'niveau'],
                include: [
                    {
                        model: Formation,
                        as: 'Formation', // L'alias doit correspondre à ton index.js
                        attributes: [['nom_formation', 'nom_theme']] // On renomme directement ici
                    },
                    {
                        model: ContenuFormation,
                        as: 'ContenuFormation',
                        attributes: [['sous_formation', 'nom_sous_theme']]
                    }
                ],
                raw: true,
                nest: true // Organise les inclusions dans des sous-objets pour éviter les conflits
            });

            // Formatage pour obtenir exactement le même résultat plat que ton fetchAll(PDO::FETCH_ASSOC)
            return cours.map(c => ({
                id: c.id,
                titre: c.titre,
                description: c.description,
                prix: c.prix,
                photo: c.photo,
                niveau: c.niveau,
                nom_theme: c.Formation ? c.Formation.nom_theme : null,
                nom_sous_theme: c.ContenuFormation ? c.ContenuFormation.nom_sous_theme : null
            }));

        } catch (error) {
            console.error("Erreur lors de la récupération des cours du formateur :", error);
            throw error.parent;
        }
    }

    async getCoursCount(formateurId) {
        try {
            // La méthode count() de Sequelize exécute un "SELECT COUNT(*) FROM cours WHERE..."
            const totalCours = await Cours.count({
                where: {
                    formateur_id: formateurId
                }
            });

            return totalCours;
        } catch (error) {
            console.error("Erreur lors du comptage des cours :", error);
            throw error;
        }
    }
    async getVente(formateurId) {
        try {
            const ventes = await Cours.findAll({
                where: { formateur_id: formateurId },
                attributes: [
                    'id',
                    'titre',
                    'prix',
                    // COUNT(i.id) AS inscriptions
                    [fn('COUNT', col('Inscriptions.id')), 'inscriptions'],
                    // SUM(c.prix) AS revenu
                    // Note : On multiplie le prix du cours par le nombre d'inscriptions trouvées
                    [fn('SUM', col('prix')), 'revenu']
                ],
                include: [{
                    model: Inscription,
                    as: 'Inscriptions',
                    where: { statut_paiement: 'paye' },
                    required: false, // Équivalent du LEFT JOIN
                    attributes: []   // On ne veut pas les colonnes individuelles de l'inscription
                }],
                group: ['id', 'titre', 'prix'],
                raw: true
            });

            return ventes;
        } catch (error) {
            console.error("Erreur lors de la récupération des ventes :", error);
            throw error;
        }
    }

    async getApprenant(formateurId) {
        try {
            const sql = `
            SELECT 
                c.id, 
                c.titre, 
                u.id AS utilisateur_id, 
                u.nom AS utilisateur_nom,
                COUNT(DISTINCT m.id) AS total_modules,
                COUNT(DISTINCT comp.id) AS modules_termines
            FROM cours c
            LEFT JOIN inscriptions i ON c.id = i.cours_id AND i.statut_paiement = 'paye'
            LEFT JOIN utilisateurs u ON i.utilisateur_id = u.id
            LEFT JOIN modules m ON m.cours_id = c.id
            LEFT JOIN completions comp ON comp.module_id = m.id AND comp.utilisateur_id = u.id
            WHERE c.formateur_id = :formateurId
            GROUP BY c.id, c.titre, u.id, u.nom
            HAVING u.id IS NOT NULL
            ORDER BY c.id, u.nom
        `;

            const apprenants = await sequelize.query(sql, {
                replacements: { formateurId: formateurId },
                type: QueryTypes.SELECT,
            });

            // Optionnel : Ajouter le pourcentage de progression en JS pour plus de clarté
            return apprenants.map(a => ({
                ...a,
                progression: a.total_modules > 0
                    ? Math.round((a.modules_termines / a.total_modules) * 100)
                    : 0
            }));

        } catch (error) {
            console.error("Erreur dans getApprenant :", error);
            throw error;
        }
    }
}

module.exports = new CoursRepositories();
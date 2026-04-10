const Completion = require('./completion.model')
const Contact = require('./contact.model')
const ContenuFormation = require('./contenu_formation.model')
const Cours = require('./cours.model')
const Formateur = require('./formateur.model')
const Formation = require('./formation.model')
const Forum = require('./forum.model')
const Inscription = require('./inscriptions.model')
const JournalActivite = require('./journal_activite.model')
const LeconCompletee = require('./lecon_complete.model')
const Lecon = require('./lecon.model')
const Module = require('./module.model')
const Post = require('./posts.model')
const Question = require('./questions.model')
const Quiz = require('./quiz.model')
const ResultatQuiz = require('./resultat_quiz.model')
const User = require('./utilisateur.model')

// Relations Formations <-> Contenu
Formation.hasMany(ContenuFormation, { foreignKey: 'formation_id' });
ContenuFormation.belongsTo(Formation, { foreignKey: 'formation_id' });

// Relations Cours <-> Formation / Sous-Formation
Formation.hasMany(Cours, { foreignKey: 'formation_id' });
Cours.belongsTo(Formation, { foreignKey: 'formation_id' });

ContenuFormation.hasMany(Cours, { foreignKey: 'contenu_formation_id' });
Cours.belongsTo(ContenuFormation, { foreignKey: 'contenu_formation_id' });

// Relations Formateurs <-> Cours
Formateur.hasMany(Cours, { foreignKey: 'formateur_id' });
Cours.belongsTo(Formateur, { foreignKey: 'formateur_id' });

// Relations Cours <-> Modules <-> Leçons
Cours.hasMany(Module, { foreignKey: 'cours_id' });
Module.belongsTo(Cours, { foreignKey: 'cours_id' });

Module.hasMany(Lecon, { foreignKey: 'module_id' });
Lecon.belongsTo(Module, { foreignKey: 'module_id' });

// Inscriptions (Utilisateurs <-> Cours)
User.hasMany(Inscription, { foreignKey: 'utilisateur_id' });
Inscription.belongsTo(User, { foreignKey: 'utilisateur_id' });
Cours.hasMany(Inscription, { foreignKey: 'cours_id' });
Inscription.belongsTo(Cours, { foreignKey: 'cours_id' });

// Complétions Modules
User.hasMany(Completion, { foreignKey: 'utilisateur_id' });
Completion.belongsTo(User, { foreignKey: 'utilisateur_id' });
Module.hasMany(Completion, { foreignKey: 'module_id' });
Completion.belongsTo(Module, { foreignKey: 'module_id' });

// Complétions Leçons
User.hasMany(LeconCompletee, { foreignKey: 'utilisateur_id' });
LeconCompletee.belongsTo(User, { foreignKey: 'utilisateur_id' });
Lecon.hasMany(LeconCompletee, { foreignKey: 'lecon_id' });
LeconCompletee.belongsTo(Lecon, { foreignKey: 'lecon_id' });

// Forum & Posts
Cours.hasMany(Forum, { foreignKey: 'cours_id' });
Forum.belongsTo(Cours, { foreignKey: 'cours_id' });

Forum.hasMany(Post, { foreignKey: 'forum_id' });
Post.belongsTo(Forum, { foreignKey: 'forum_id' });

User.hasMany(Post, { foreignKey: 'auteur_id' });
Post.belongsTo(User, { foreignKey: 'auteur_id' });

// Journal d'activité Admin
User.hasMany(JournalActivite, { foreignKey: 'admin_id' });
JournalActivite.belongsTo(User, { foreignKey: 'admin_id' });

// Quiz <-> Questions
Module.hasMany(Quiz, { foreignKey: 'module_id' });
Quiz.belongsTo(Module, { foreignKey: 'module_id' });

Quiz.hasMany(Question, { foreignKey: 'quiz_id' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id' });

// Résultats Quiz
User.hasMany(ResultatQuiz, { foreignKey: 'utilisateur_id' });
ResultatQuiz.belongsTo(User, { foreignKey: 'utilisateur_id' });
Quiz.hasMany(ResultatQuiz, { foreignKey: 'quiz_id' });
ResultatQuiz.belongsTo(Quiz, { foreignKey: 'quiz_id' });

const db = {
    Completion, Contact, ContenuFormation, Cours, Formateur, Formation, Forum, Inscription, JournalActivite, LeconCompletee, Lecon, Module, Post, Question, Quiz, ResultatQuiz, User
}

module.exports = db;
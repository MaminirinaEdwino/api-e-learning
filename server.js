const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// --- 1. MIDDLEWARES DE BASE ---
// Remplace $_POST et $_GET
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration de la session (Équivalent PHP $_SESSION)
app.use(session({
    secret: 'votre_cle_secrete_yitro',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettre à true si vous passez en HTTPS
}));

// --- 2. MOTEUR DE TEMPLATE ---
// On remplace TemplateRender par EJS (très proche du PHP/HTML)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Dossier public pour les assets et les Uploads (images, CV, PDF)
app.use('/public', express.static('public'));
app.use('/Uploads', express.static('Uploads'));

// --- 3. IMPORTATION DES ROUTES ---
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const formationRoutes = require('./src/routes/formationRoutes');
const coursRoutes = require('./src/routes/coursRoutes');
const forumRoutes = require('./src/routes/forumRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const userRoutes = require('./src/routes/userAdminRoutes');
const journalRoutes = require('./src/routes/journalRoutes');
const signinRoutes = require('./src/routes/signinRoutes');

// --- 4. UTILISATION DES ROUTES ---
app.use(authRoutes);
app.use(adminRoutes);
app.use(formationRoutes);
app.use(coursRoutes);
app.use(forumRoutes);
app.use(quizRoutes);
app.use(userRoutes);
app.use(journalRoutes);
app.use(signinRoutes);

// --- 5. GESTION DES ERREURS 404 ---
app.use((req, res) => {
    res.status(404).render('errors/404', { message: "Page non trouvée" });
});

// --- 6. LANCEMENT DU SERVEUR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur Yitro lancé sur http://localhost:${PORT}`);
});
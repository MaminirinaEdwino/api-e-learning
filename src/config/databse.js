const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Configuration de l'instance Sequelize
 * On récupère les identifiants depuis le fichier .env
 */
const sequelize = new Sequelize(
    process.env.DB_NAME,     // Nom de la base (ex: yitro_db)
    process.env.DB_USER,     // Utilisateur (ex: root)
    process.env.DB_PASS,     // Mot de passe
    {
        host: process.env.DB_HOST,   // Serveur (ex: localhost)
        dialect: 'mysql',            // Type de base de données
        logging: false,              // Désactive l'affichage des requêtes SQL dans la console
        port: process.env.DB_PORT || 3306,
        define: {
            timestamps: false,       // Désactive createdAt/updatedAt par défaut (pour coller à votre SQL)
            underscored: true        // Utilise snake_case pour les colonnes
        },
        pool: {
            max: 5,                  // Nombre max de connexions simultanées
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Fonction de test de la connexion
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à MySQL établie avec succès.');
    } catch (error) {
        console.error('❌ Impossible de se connecter à la base de données:', error);
    }
};

testConnection();

module.exports = sequelize;
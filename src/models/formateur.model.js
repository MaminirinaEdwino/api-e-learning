const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Formateur = sequelize.define('Formateur', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom_prenom: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telephone: DataTypes.STRING,
    ville_pays: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    intitule_metier: DataTypes.STRING,
    experience_formation: DataTypes.STRING,
    detail_experience: DataTypes.TEXT,
    cv: DataTypes.STRING,
    categories: DataTypes.STRING,
    autre_domaine: DataTypes.STRING,
    titre_cours: DataTypes.STRING,
    objectif: DataTypes.TEXT,
    public_cible: DataTypes.TEXT,
    detail_complementaire: DataTypes.TEXT,
    formats: DataTypes.STRING,
    format_autre: DataTypes.STRING,
    duree_estimee: DataTypes.STRING,
    type_formation: DataTypes.STRING,
    motivation: DataTypes.TEXT,
    valeur: DataTypes.TEXT,
    profil_public: DataTypes.TEXT,
    statut: { type: DataTypes.ENUM('en attente', 'verifie', 'premium', 'partenaire'), defaultValue: 'en attente' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    code_entree: DataTypes.STRING,
    password: { type: DataTypes.STRING }
}, { tableName: 'formateurs', timestamps: false });

module.exports = Formateur;
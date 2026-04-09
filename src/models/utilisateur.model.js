const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    mot_de_passe: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'apprenant'), defaultValue: 'apprenant' },
    telephone: DataTypes.STRING,
    photo: DataTypes.STRING,
    pays: DataTypes.STRING,
    langue: DataTypes.STRING,
    autre_langue: DataTypes.STRING,
    objectifs: DataTypes.TEXT,
    type_cours: DataTypes.STRING,
    niveau_formation: DataTypes.STRING,
    niveau_etude: DataTypes.STRING,
    acces_internet: DataTypes.STRING,
    appareil: DataTypes.STRING,
    accessibilite: DataTypes.TEXT,
    rgpd: { type: DataTypes.BOOLEAN, defaultValue: false },
    charte: { type: DataTypes.BOOLEAN, defaultValue: false },
    actif: {type: DataTypes.BOOLEAN}
}, { tableName: 'utilisateurs', timestamps: false });

module.exports = User;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inscription = sequelize.define('Inscription', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    utilisateur_id: { type: DataTypes.INTEGER, allowNull: false },
    cours_id: { type: DataTypes.INTEGER, allowNull: false },
    date_inscription: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    statut_paiement: { type: DataTypes.ENUM('en_attente', 'paye', 'annule'), defaultValue: 'en_attente' }
}, { tableName: 'inscriptions', timestamps: false });

module.exports = Inscription;
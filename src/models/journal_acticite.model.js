const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JournalActivite = sequelize.define('JournalActivite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    utilisateur_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    details: DataTypes.TEXT,
    date_action: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'journal_activite', timestamps: false });

module.exports = JournalActivite;
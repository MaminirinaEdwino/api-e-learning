const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JournalActivite = sequelize.define('JournalActivite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    admin_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    details: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'journal_activite', timestamps: false });

module.exports = JournalActivite;
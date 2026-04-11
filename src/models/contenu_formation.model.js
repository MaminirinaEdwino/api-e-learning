const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContenuFormation = sequelize.define('ContenuFormation', {
    id_contenu: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    formation_id: { type: DataTypes.INTEGER, allowNull: false },
    sous_formation: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'contenu_formations', timestamps: false });

module.exports = ContenuFormation;
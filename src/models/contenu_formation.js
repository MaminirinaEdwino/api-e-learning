const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContenuFormation = sequelize.define('ContenuFormation', {
    id_contenu_formation: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_formation: { type: DataTypes.INTEGER, allowNull: false },
    sous_formation: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'contenu_formations', timestamps: false });

module.exports = ContenuFormation;
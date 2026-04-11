const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_formateur: { type: DataTypes.INTEGER, allowNull: false },
    id_formation: { type: DataTypes.INTEGER, allowNull: false },
    id_contenu_formation: { type: DataTypes.INTEGER, allowNull: false },
    titre: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    prix: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    photo: DataTypes.STRING,
    niveau: DataTypes.STRING,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'cours', timestamps: false });

module.exports = Course;
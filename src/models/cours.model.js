const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    formateur_id: { type: DataTypes.INTEGER, allowNull: false },
    formation_id: { type: DataTypes.INTEGER, allowNull: false },
    contenu_formation_id: { type: DataTypes.INTEGER, allowNull: false },
    titre: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    prix: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    photo: DataTypes.STRING,
    niveau: DataTypes.STRING,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'cours', timestamps: false });

module.exports = Course;
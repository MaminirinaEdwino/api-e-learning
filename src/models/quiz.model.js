const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    module_id: { type: DataTypes.INTEGER, allowNull: false },
    question: { type: DataTypes.TEXT, allowNull: false },
    options: { type: DataTypes.JSON, allowNull: false }, // Les options en JSON
    reponse_correcte: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'quiz', timestamps: false });

module.exports = Quiz;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResultatQuiz = sequelize.define('ResultatQuiz', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    utilisateur_id: { type: DataTypes.INTEGER, allowNull: false },
    module_id: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.INTEGER, allowNull: false },
    date_tentative: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'resultats_quiz', timestamps: false });

module.exports = ResultatQuiz;
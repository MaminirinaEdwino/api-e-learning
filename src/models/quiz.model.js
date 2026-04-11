const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    module_id: { type: DataTypes.INTEGER, allowNull: false },
    titre : {type: DataTypes.INTEGER, allowNull: false},
    description : {type: DataTypes.STRING, allowNull: false},
    score_minimum: {type: DataTypes.INTEGER}
}, { tableName: 'quiz', timestamps: false });

module.exports = Quiz;
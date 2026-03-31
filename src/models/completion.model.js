const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Completion = sequelize.define('Completion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    utilisateur_id: { type: DataTypes.INTEGER, allowNull: false },
    module_id: { type: DataTypes.INTEGER, allowNull: false },
    cours_id: { type: DataTypes.INTEGER, allowNull: false },
    date_completion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'completions', timestamps: false });

module.exports = Completion;
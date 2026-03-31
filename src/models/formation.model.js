const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Formation = sequelize.define('Formation', {
    id_formation: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom_formation: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'formations', timestamps: false });

module.exports = Formation;
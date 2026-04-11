const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lecon = sequelize.define('Lecon', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    module_id: { type: DataTypes.INTEGER, allowNull: false },
    titre: { type: DataTypes.STRING, allowNull: false },
    format: DataTypes.STRING,
    fichier: DataTypes.TEXT
}, { tableName: 'lecons', timestamps: false });

module.exports = Lecon;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define('Lecon', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    module_id: { type: DataTypes.INTEGER, allowNull: false },
    titre: { type: DataTypes.STRING, allowNull: false },
    contenu: DataTypes.TEXT,
    video_url: DataTypes.STRING,
    ordre: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'lecons', timestamps: false });

module.exports = Lesson;
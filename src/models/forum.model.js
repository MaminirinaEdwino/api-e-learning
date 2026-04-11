const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Forum = sequelize.define('Forum', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cours_id: { type: DataTypes.INTEGER, allowNull: false },
    titre: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    date_creation: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'forum', timestamps: false });

module.exports = Forum;
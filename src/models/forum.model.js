const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Forum = sequelize.define('Forum', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cours_id: { type: DataTypes.INTEGER, allowNull: false },
    titre: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'forums', timestamps: false });

module.exports = Forum;
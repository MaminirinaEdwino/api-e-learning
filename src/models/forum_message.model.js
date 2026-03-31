const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ForumMessage = sequelize.define('ForumMessage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    post_id: { type: DataTypes.INTEGER, allowNull: false },
    utilisateur_id: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'forum_messages', timestamps: false });

module.exports = ForumMessage;
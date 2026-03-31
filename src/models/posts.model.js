const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    forum_id: { type: DataTypes.INTEGER, allowNull: false },
    utilisateur_id: { type: DataTypes.INTEGER, allowNull: false },
    contenu: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'posts', timestamps: false });

module.exports = Post;
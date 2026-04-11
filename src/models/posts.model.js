const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    forum_id: { type: DataTypes.INTEGER, allowNull: false },
    auteur_id: { type: DataTypes.INTEGER, allowNull: false },
    contenu: { type: DataTypes.TEXT, allowNull: false },
    date_post: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'post', timestamps: false });

module.exports = Post;
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ForumMessage extends Model {}

ForumMessage.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cours_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Correspond au DEFAULT NULL du SQL
        references: {
            model: 'cours',
            key: 'id'
        }
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Correspond au DEFAULT NULL du SQL
        references: {
            model: 'utilisateurs',
            key: 'id'
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    lu: {
        type: DataTypes.BOOLEAN, // Sequelize transforme tinyint(1) en Boolean
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'ForumMessage',
    tableName: 'forum_messages',
    timestamps: false, // On utilise la colonne "date" manuellement ou via hook
    underscored: true
});

module.exports = ForumMessage;
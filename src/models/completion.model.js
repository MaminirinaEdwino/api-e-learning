const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database'); // Ton instance de connexion

class Completion extends Model { }

Completion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'utilisateurs',
            key: 'id'
        }
    },
    module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modules',
            key: 'id'
        }
    },
    cours_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cours',
            key: 'id'
        }
    },
    date_completion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Completion',
    tableName: 'completions',
    timestamps: false, // On utilise date_completion à la place de updatedAt/createdAt
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['utilisateur_id', 'module_id']
        }
    ]
});

module.exports = Completion;
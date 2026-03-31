const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeconCompletee = sequelize.define('LeconCompletee', {
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
    lecon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'lecons',
            key: 'id'
        }
    },
    date_completion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'lecons_completees',
    timestamps: false,
    underscored: true
});

module.exports = LeconCompletee;
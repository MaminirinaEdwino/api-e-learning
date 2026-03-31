const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'quiz', // Nom de la table de référence
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    texte: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reponse_correcte: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reponse_incorrecte_1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reponse_incorrecte_2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reponse_incorrecte_3: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'questions',
    timestamps: false, // Pas de colonnes createdAt/updatedAt dans votre SQL
    underscored: true
});

module.exports = Question;
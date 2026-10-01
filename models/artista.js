const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Artista = sequelize.define(
    'Artista',
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },

        nacionalidade: {
            type: DataTypes.STRING
        },

        dataNascimento: {
            type: DataTypes.DATE
        },

        biografia: {
            type: DataTypes.STRING
        },

        tipo: {
            type: DataTypes.STRING
        },

        papeis: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: 'Artistas',
        timestamps: true
    }
);

module.exports = Artista;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Filme = sequelize.define(
    'Filme',
    {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },

        ano: {
            type: DataTypes.INTEGER
        },

        sinopse: {
            type: DataTypes.STRING
        },

        duracao: {
            type: DataTypes.INTEGER
        },

        genero: {
            type: DataTypes.STRING
        },

        clasIndicativa: {
            type: DataTypes.INTEGER
        },

        paisOrigem: {
            type: DataTypes.STRING
        },

        diretorId: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: 'Filmes',
        timestamps: true
    }
);

module.exports = Filme;
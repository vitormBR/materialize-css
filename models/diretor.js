const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Diretor = sequelize.define(
    'Diretor',
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        foto: {
            type: DataTypes.STRING
        },
        dataNascimento: {
            type: DataTypes.DATE
        },
        biografia: {
            type: DataTypes.TEXT
        },
        nacionalidade: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: 'Diretores',
        timestamps: true
    }
);

module.exports = Diretor;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const FichaTecnica = sequelize.define(
    'FichaTecnica',
    {
        filmeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        roteirista: {
            type: DataTypes.STRING
        },

        produtor: {
            type: DataTypes.STRING
        },

        compositor: {
            type: DataTypes.STRING
        },

        editor: {
            type: DataTypes.STRING
        },

        duracao: {
            type: DataTypes.INTEGER
        },

        orcamento: {
            type: DataTypes.DECIMAL(10, 2)
        }
    },
    {
        tableName: 'FichaTecnicas',
        timestamps: true
    }
);

module.exports = FichaTecnica;
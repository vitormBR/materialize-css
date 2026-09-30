const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Filme = sequelize.define(
  'Filme', 
  {
    nome: {
      type: DataTypes.STRING,
    },
    anoLancamento: {
      type: DataTypes.INTEGER,
    },
    sinopse: {
        type: DataTypes.STRING,
    },
    duracao: {
        type: DataTypes.DATE,
    },
    genero: {
        type: DataTypes.STRING,
    },
    clasIndicativa:{
        type: DataTypes.INTEGER,
    },
    paisOrigem:{
        type: DataTypes.STRING,
    },
    diretor: {
        type: DataTypes.STRING,
    },
    elenco:{
        type: DataTypes.STRING
    }

  },
  {
    tableName: 'Filmes',
    timestamps: true
  }
);

module.exports = Filme;
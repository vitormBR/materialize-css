const {DataTypes} = require('sequelize');
const sequelize = require('../config/bd');


const Artista = sequelize.define(
    'Artista',
    {nome :{
        type: DataTypes.STRING,
     },
     nacionalidade: {
        type:DataTypes.STRING,
     },
     dataNascimento: {
        type:DataTypes.DATE,
     },
     biografia: {
        type:DataTypes.STRING,
     },
     tipo : {
        type:DataTypes.STRING,
     },
     papeis: {
        type:DataTypes.STRING
     }
    },

);

module.exports = Artista;


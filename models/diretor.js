const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');


const diretor = sequelize.define(
    'Artista',
    {nome :{
        type: DataTypes.STRING,
     },
     foto: {
        type:DataTypes.INTEGER,
     },
     dataNascimento: {
        type:DataTypes.DATE,
     },
     biografia: {
        type:DataTypes.STRING,
     },
     filmedirigido: {
        type:DataTypes.STRING,
     },
     nacionalidade  : {
        type:DataTypes.STRING
     }
    },
)





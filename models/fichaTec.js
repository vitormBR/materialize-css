const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');


const fichaTec = sequelize.define(
    'fichaTec',
    {filme: {
        type: DataTypes.STRING
    },
    diretor: {
        type:DataTypes.STRING
    },
    roterista: {
        type:DataTypes.STRING
    },
    produtor: {
        type:DataTypes.STRING
    },
    compositor: {
        type:DataTypes.STRING
    },
    editor:{
        type:DataTypes.STRING
    },
    duracao:{
        type:DataTypes.DATE
    },
    orcamento:{
        type:DataTypes.DECIMAL(10,2)
    },
    },
)    
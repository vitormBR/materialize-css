const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './bd.sqlite',
    logging: console.log
});

module.exports = sequelize;

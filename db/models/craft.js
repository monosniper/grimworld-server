const { DataTypes} = require('sequelize');
const sequelize = require("../index");

const Craft = sequelize.define('Craft',
    {},
    {
        timestamps: true,
    });

module.exports = Craft
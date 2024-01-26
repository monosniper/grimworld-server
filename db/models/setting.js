const { DataTypes} = require('sequelize');
const sequelize = require("../index");

const Setting = sequelize.define('Setting', {
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

module.exports = Setting
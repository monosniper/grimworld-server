const { DataTypes} = require('sequelize');
const sequelize = require("../index");

const CraftItem = sequelize.define('CraftItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    column: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = CraftItem
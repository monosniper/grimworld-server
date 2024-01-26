const { DataTypes} = require('sequelize');
const sequelize = require("../index");

const Item = sequelize.define('Item', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Item
const { DataTypes} = require('sequelize');
const sequelize = require("../index");

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price_1: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price_2: {
        type: DataTypes.INTEGER,
    },
    price_3: {
        type: DataTypes.INTEGER,
    },
    price_forever: {
        type: DataTypes.INTEGER,
    },
    isPrivilege: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rcon_slug: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

module.exports = Product
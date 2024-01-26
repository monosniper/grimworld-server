const { DataTypes} = require('sequelize');
const sequelize = require("../index");

const Media = sequelize.define('Media', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Media
const { DataTypes } = require("sequelize");

const sequelize = require("../database");

const Organization = sequelize.define(
    "Organization",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: "organizations",
    }
);

module.exports = Organization;
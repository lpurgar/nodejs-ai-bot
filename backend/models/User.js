const { DataTypes } = require("sequelize");

const sequelize = require("../database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("USER", "ADMIN"),
            defaultValue: "USER",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: true,
        tableName: "users",
    }
);

module.exports = User;
module.exports = User;

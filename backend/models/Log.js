const { DataTypes } = require("sequelize");

const sequelize = require("../database");

const Log = sequelize.define(
    "Log",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        action: {
            type: DataTypes.ENUM(
                "Create",
                "Update",
                "Delete",
                "Login",
                "Logout"
            ),
            allowNull: false,
        },
        table: {
            type: DataTypes.ENUM(
                "User",
                "Conversation",
                "Message",
                "Organization"
            ),
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: "logs",
    }
);

module.exports = Log;
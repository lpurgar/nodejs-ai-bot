const { DataTypes } = require("sequelize");

const sequelize = require("../database");
const User = require("./User");

const Conversation = sequelize.define(
    "Conversation",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id",
            },
            allowNull: false,
        },
    },
    {
        tableName: "conversations",
        timestamps: true,
    }
);

module.exports = Conversation;
const { DataTypes } = require("sequelize");

const sequelize = require("../database");

const Message = sequelize.define(
    "Message",
    {
        sender: {
            type: DataTypes.ENUM("USER", "AI"),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "messages",
        timestamps: true,
    }
);

module.exports = Message;
module.exports = Message;

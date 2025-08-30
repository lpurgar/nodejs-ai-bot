const sequelize = require("../database");
const User = require("./User");
const Conversation = require("./Conversation").default;
const Message = require("./Message");
const Log = require("./Logs");
const Organization = require("./Organization");

User.hasMany(Conversation, { foreignKey: "userId", onDelete: "CASCADE" });
Conversation.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Message, { foreignKey: "userId", onDelete: "CASCADE" });
Message.belongsTo(User, { foreignKey: "userId" });

Conversation.hasMany(Message, {
    foreignKey: "conversationId",
    onDelete: "CASCADE",
});
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

User.hasMany(Log, { foreignKey: "userId", onDelete: "CASCADE" });
Log.belongsTo(User, { foreignKey: "userId" });

Organization.hasMany(User, {
    foreignKey: "organizationId",
    onDelete: "CASCADE",
});
User.belongsTo(Organization, { foreignKey: "organizationId" });

module.exports = {
    sequelize,
    User,
    Conversation,
    Message,
    Log,
    Organization,
};

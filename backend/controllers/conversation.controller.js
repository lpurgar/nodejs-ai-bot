const { Conversation, Message, Log } = require("../models");

exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.findAll({
            where: { userId: req.user.id },
            order: [["createdAt", "DESC"]],
        });
        if (conversations.length === 0) {
            res.status(200).json({
                data: [],
                message: `No ${Conversation.name}s found`,
            });
        }
        res.status(200).json({ data: conversations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.createConversation = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const title = req.body.title;
        const conversation = await Conversation.create({
            title,
            userId,
        });
        await Log.create({
            action: "Create",
            userId,
            table: Conversation.tableName,
        });
        res.status(201).json(conversation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            where: { userId: req.user.id },
            include: Message,
            order: [["createdAt", "DESC"]],
        });

        res.json({ data: conversation || null });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteConversation = async (req, res) => {
    try {
        const { params, user } = req;
        const deleted = await Conversation.destroy({
            where: { id: params.id, userId: user.id },
        });

        if (!deleted) {
            return res
                .status(404)
                .json({ message: "Conversation not found or not authorized" });
        }

        await Log.create({
            action: "Delete",
            userId: user.id,
            table: Conversation.tableName,
        });

        res.json({ message: `Conversation with id ${params.id} deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
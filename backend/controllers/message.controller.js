const { OpenAI } = require("openai");

const { Message, Conversation } = require("../models");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.sendMessage = async (req, res) => {
    const { conversationId, content } = req.body;

    try {
        const conversation = await Conversation.findOne({
            where: { id: conversationId, userId: req.user.id },
        });

        if (!conversation) {
            return res
                .status(404)
                .json({ message: "Conversation not found or not yours" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content }],
        });

        const aiResponse =
            completion.choices[0]?.message?.content || "No response";

        const userMessage = Message.create({
            conversationId,
            userId: req.user.id,
            sender: "USER",
            content,
        });

        const aiMessage = Message.create({
            conversationId,
            userId: req.user.id,
            sender: "AI",
            content: aiResponse,
        });

        await Promise.all([userMessage, aiMessage]);

        await Log.create({
            action: "Create",
            userId: user.id,
            table: Message.tableName,
        });

        res.json({
            userMessage,
            aiMessage,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to process message" });
    }
};

exports.getMessages = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const conversation = await Conversation.findOne({
            where: { id: conversationId, userId: req.user.id },
        });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const messages = await Message.findAll({
            where: { conversationId },
            order: [["createdAt", "ASC"]],
        });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Failed to get messages" });
    }
};
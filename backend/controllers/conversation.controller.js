const { Conversation, Message } = require("../models");

// Get all conversations for logged-in user
exports.getAllConversations = async (req, res) => {
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

// Create new conversation
exports.createConversation = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const title = req.body.title;
        const conversation = await Conversation.create({
            title,
            userId,
        });
        res.status(201).json(conversation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get one conversation with messages
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

// Delete conversation
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

        res.json({ message: `Conversation with id ${params.id} deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Create new conversation
exports.createConversation = async (req, res) => {
  try {
    const conversation = await Conversation.create({
      title: req.body.title || null,
      userId: req.user.id,
    });
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get one conversation with messages
exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [Message],
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { params, user } = req;
    const deleted = await Conversation.destroy({
      where: { id: params.id, userId: user.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Conversation not found or not authorized' });
    }

    res.json({ message: `Conversation with id ${params.id} deleted` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

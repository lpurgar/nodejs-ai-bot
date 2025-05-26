const { OpenAI } = require('openai');

const { Message, Conversation } = require('../models');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.sendMessage = async (req, res) => {
  const { conversationId, content } = req.body;

  try {
    const conversation = await Conversation.findOne({
      where: { id: conversationId, userId: req.user.id }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found or not yours' });
    }

    // Save user message
    const userMessage = await Message.create({
      conversationId,
      userId: req.user.id,
      sender: 'USER',
      content
    });

    // Send to OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content }
      ]
    });

    const aiResponse = completion.choices[0]?.message?.content || 'No response';

    // Save AI message
    const aiMessage = await Message.create({
      conversationId,
      userId: req.user.id,
      sender: 'AI',
      content: aiResponse
    });

    res.json({
      userMessage,
      aiMessage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process message' });
  }
};

// Get all messages in a conversation
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findOne({
      where: { id: conversationId, userId: req.user.id }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

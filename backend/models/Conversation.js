const { DataTypes } = require('sequelize');

const sequelize = require('../database');

const Conversation = sequelize.define('Conversation', {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'conversations',
  timestamps: true,
});

module.exports = Conversation;

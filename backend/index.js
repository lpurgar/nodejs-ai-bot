const express = require('express');
const cors = require('cors');

const sequelize = require('./database');
const authRoutes = require('./routes/auth.route');
const conversationRoutes = require('./routes/conversation.route');
const messageRoutes = require('./routes/message.route');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/conversation', conversationRoutes);
app.use('/message', messageRoutes);

async function start() {
  try {
    sequelize.sync().then(() => { console.log('✅ Database synced.') })

    await sequelize.authenticate();
    console.log('✅ Connected to SQLite database.');

    app.listen(PORT, () => {
      console.log(`🚀 Server listening at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
  }
}

start();

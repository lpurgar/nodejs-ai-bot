const express = require('express');
const cors = require('cors');
const sequelize = require('./database');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('🚀 SQLite + Sequelize API running');
});

// DB connection and sync
async function start() {
  try {
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

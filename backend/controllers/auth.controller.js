const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

// Register
exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) return res.status(409).json({ error: 'User already exists with this username' });

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT) || 10);

  const newUser = await User.create({
    username,
    password: hashedPassword,
    role: role || 'USER',
  });

  const jsonResponse = {
    message: 'User registered',
    user: {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    }
  }
  
  res.status(201).json(jsonResponse);
  
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ error: 'User with this username does not exist' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '1h' }
  );

  res.json({ message: 'Logged in', token });
};
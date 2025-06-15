const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
const {
  sendMessage,
  getMessages
} = require('../controllers/message.controller');

router.use(authenticate);

router.post('/', sendMessage);
router.get('/:conversationId', getMessages);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
const {
  sendMessage,
  getMessages
} = require('../controllers/message.controller');

router.use(authenticate);

router.post('/', sendMessage); // POST /api/messages
router.get('/:conversationId', getMessages); // GET /api/messages/:conversationId

module.exports = router;

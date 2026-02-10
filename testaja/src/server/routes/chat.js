const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');
const { optionalAuth } = require('../middleware/auth');

// Chat with AI financial companion (public access with optional auth)
router.post('/message', optionalAuth, ChatController.processMessage.bind(ChatController));

// Get chat history
router.get('/history', optionalAuth, ChatController.getHistory.bind(ChatController));

module.exports = router;


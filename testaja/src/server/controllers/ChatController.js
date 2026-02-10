const ChatService = require('../services/ChatService');
const ResponseHelper = require('../utils/response');

class ChatController {
  /**
   * Process chat message
   */
  async processMessage(req, res) {
    try {
      const { message, conversationId } = req.body;
      // Use userId if authenticated, otherwise use 0 for public access
      const userId = req.user?.userId || 0;
      const result = await ChatService.processMessage(
        userId,
        message,
        conversationId
      );
      return ResponseHelper.success(res, result);
    } catch (error) {
      return ResponseHelper.error(res, error, error.statusCode || 500);
    }
  }

  /**
   * Get chat history
   */
  async getHistory(req, res) {
    try {
      // In production, fetch from database
      return ResponseHelper.success(res, { messages: [] });
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }
}

module.exports = new ChatController();


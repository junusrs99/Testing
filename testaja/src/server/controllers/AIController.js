const AIService = require('../services/AIService');
const ResponseHelper = require('../utils/response');

class AIController {
  /**
   * Get AI insights
   */
  async getInsights(req, res) {
    try {
      const userId = req.user?.userId || 0;
      const insights = await AIService.generateInsights(userId).catch(() => ({}));
      return ResponseHelper.success(res, insights);
    } catch (error) {
      return ResponseHelper.error(res, error, error.statusCode || 500);
    }
  }

  /**
   * Get financial twin data
   */
  async getFinancialTwin(req, res) {
    try {
      const userId = req.user?.userId || 0;
      const financialTwin = await AIService.generateFinancialTwin(userId).catch(() => ({}));
      return ResponseHelper.success(res, financialTwin);
    } catch (error) {
      return ResponseHelper.error(res, error, error.statusCode || 500);
    }
  }

  /**
   * Get credit recommendations
   */
  async getCreditRecommendations(req, res) {
    try {
      const userId = req.user?.userId || 0;
      // Return default recommendations
      return ResponseHelper.success(res, [
        {
          title: 'Reduce Credit Card Balances',
          description: 'Lower your credit utilization below 30% by paying down $500 on your credit cards',
          impact: 'Could increase score by 15-20 points',
          priority: 'high',
          action: 'Pay Extra Now',
        },
        {
          title: 'Request Credit Limit Increase',
          description: 'Ask your credit card issuer for a limit increase to improve utilization ratio',
          impact: 'Could increase score by 5-10 points',
          priority: 'medium',
          action: 'Request Increase',
        },
        {
          title: 'Keep Old Accounts Open',
          description: 'Maintain your oldest credit accounts to preserve credit history length',
          impact: 'Maintains current score',
          priority: 'low',
        },
      ]);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }
}

module.exports = new AIController();


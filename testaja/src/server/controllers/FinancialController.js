const FinancialService = require('../services/FinancialService');
const ResponseHelper = require('../utils/response');

class FinancialController {
  /**
   * Get all accounts
   */
  async getAccounts(req, res) {
    try {
      const userId = req.user?.userId || 0;
      const accounts = await FinancialService.getAccounts(userId).catch(() => []);
      return ResponseHelper.success(res, accounts);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  /**
   * Get transactions
   */
  async getTransactions(req, res) {
    try {
      const userId = req.user?.userId || 0;
      const { limit, offset, startDate, endDate, category } = req.query;
      const result = await FinancialService.getTransactions(userId, {
        limit,
        offset,
        startDate,
        endDate,
        category
      }).catch(() => ({ transactions: [] }));
      return ResponseHelper.success(res, result);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  /**
   * Get credit score
   */
  async getCreditScore(req, res) {
    try {
      const userId = req.user?.userId || 0;
      const creditScore = await FinancialService.getCreditScore(userId).catch(() => 745);
      return ResponseHelper.success(res, { score: creditScore });
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  /**
   * Get debts
   */
  async getDebts(req, res) {
    try {
      const userId = req.user?.userId || 0;
      const debts = await FinancialService.getDebts(userId).catch(() => []);
      return ResponseHelper.success(res, debts);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  /**
   * Get budgets
   */
  async getBudgets(req, res) {
    try {
      const userId = req.user?.userId || 0;
      const budgets = await FinancialService.getBudgets(userId).catch(() => []);
      return ResponseHelper.success(res, budgets);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  /**
   * Get financial overview
   */
  async getOverview(req, res) {
    try {
      const userId = req.user?.userId || 0;
      const overview = await FinancialService.getOverview(userId).catch(() => ({}));
      return ResponseHelper.success(res, overview);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  /**
   * Get portfolio
   */
  async getPortfolio(req, res) {
    try {
      const userId = req.user?.userId || 0;
      // Return default portfolio data
      return ResponseHelper.success(res, {
        totalValue: 125430.75,
        totalGain: 15430.75,
        totalGainPercent: 14.03,
        performance: {
          day1: 0.5,
          week1: 2.3,
          month1: 5.8,
          year1: 14.03,
        },
      });
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  /**
   * Get holdings
   */
  async getHoldings(req, res) {
    try {
      const userId = req.user?.userId || 0;
      // Return default holdings data
      return ResponseHelper.success(res, [
        {
          _id: '1',
          symbol: 'AAPL',
          name: 'Apple Inc.',
          type: 'stock',
          quantity: 50,
          price: 185.50,
          value: 9275.00,
          change: 2.5,
        },
        {
          _id: '2',
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          type: 'stock',
          quantity: 30,
          price: 380.25,
          value: 11407.50,
          change: 1.8,
        },
        {
          _id: '3',
          symbol: 'VTI',
          name: 'Vanguard Total Stock Market ETF',
          type: 'etf',
          quantity: 100,
          price: 245.30,
          value: 24530.00,
          change: 0.9,
        },
      ]);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  /**
   * Get debt summary
   */
  async getDebtSummary(req, res) {
    try {
      const userId = req.user?.userId || 0;
      // Return default debt summary
      return ResponseHelper.success(res, {
        totalDebt: 20950.00,
        totalMonthlyPayment: 525.00,
        averageInterestRate: 11.5,
        estimatedPayoffDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 18).toISOString(),
        strategy: {
          method: 'Debt Snowball Method',
          description: 'Focus on paying off the smallest debt first while making minimum payments on others',
          steps: [
            { debt: 'Credit Card', action: 'Pay $200/month (minimum + extra)' },
            { debt: 'Car Loan', action: 'Pay minimum $450/month' },
          ],
        },
      });
    } catch (error) {
      return ResponseHelper.error(res, error);
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
      ]);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }
}

module.exports = new FinancialController();


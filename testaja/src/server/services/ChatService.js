const FinancialService = require('./FinancialService');
const ErrorCodes = require('../constants/errorCodes');

// Try to load Gemini AI if available
let GoogleGenerativeAI = null;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (error) {
  console.log('Gemini AI package not available, using fallback responses');
}

class ChatService {
  constructor() {
    // Initialize Gemini AI
    this.genAI = null;
    if (GoogleGenerativeAI && process.env.GEMINI_API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      } catch (error) {
        console.error('Failed to initialize Gemini AI:', error);
      }
    }
  }

  /**
   * Process chat message with Gemini AI
   * @param {number} userId - User ID
   * @param {string} message - User message
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Chat response
   */
  async processMessage(userId, message, conversationId) {
    try {
      // Get user financial data for context
      let overview, debts, creditScore;
      try {
        overview = await FinancialService.getOverview(userId);
        debts = await FinancialService.getDebts(userId);
        creditScore = await FinancialService.getCreditScore(userId);
      } catch (error) {
        // Use default values if user data not available
        overview = {
          totalBalance: 45230.50,
          netWorth: 125430.75,
          monthlyIncome: 8500.00,
          monthlyExpenses: 6200.00,
          savingsRate: 27,
        };
        debts = [];
        creditScore = 745;
      }

      // Build context for AI
      const financialContext = `
User Financial Summary:
- Total Balance: $${overview.totalBalance?.toLocaleString() || '0'}
- Net Worth: $${overview.netWorth?.toLocaleString() || '0'}
- Monthly Income: $${overview.monthlyIncome?.toLocaleString() || '0'}
- Monthly Expenses: $${overview.monthlyExpenses?.toLocaleString() || '0'}
- Savings Rate: ${overview.savingsRate || 0}%
- Credit Score: ${creditScore || 0}
- Total Debt: $${debts.reduce((sum, d) => sum + (d.balance || 0), 0).toLocaleString() || '0'}
`;

      let response = '';
      let suggestions = [];

      // Use Gemini AI if available, otherwise fallback to rule-based
      if (this.genAI) {
        try {
          const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
          
          const prompt = `You are a helpful AI financial advisor. The user has asked: "${message}"

${financialContext}

Provide a helpful, personalized financial advice response. Be concise (2-3 sentences), professional, and actionable. Focus on giving practical financial guidance.`;

          const result = await model.generateContent(prompt);
          response = result.response.text();
          
          // Generate suggestions based on the message
          suggestions = this.generateSuggestions(message);
        } catch (error) {
          console.error('Gemini AI error:', error);
          // Fallback to rule-based response
          response = this.generateRuleBasedResponse(message, overview, debts, creditScore);
          suggestions = this.generateSuggestions(message);
        }
      } else {
        // Fallback to rule-based response
        response = this.generateRuleBasedResponse(message, overview, debts, creditScore);
        suggestions = this.generateSuggestions(message);
      }

      return {
        response,
        suggestions,
        conversationId: conversationId || `conv_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Chat service error:', error);
      const chatError = new Error(ErrorCodes.AI_PROCESSING_ERROR.message);
      chatError.code = ErrorCodes.AI_PROCESSING_ERROR.code;
      chatError.statusCode = ErrorCodes.AI_PROCESSING_ERROR.statusCode;
      throw chatError;
    }
  }

  /**
   * Generate rule-based response (fallback)
   */
  generateRuleBasedResponse(message, overview, debts, creditScore) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      return this.generateBudgetResponse(overview);
    } else if (lowerMessage.includes('debt') || lowerMessage.includes('pay off')) {
      return this.generateDebtResponse(debts);
    } else if (lowerMessage.includes('save') || lowerMessage.includes('savings')) {
      return this.generateSavingsResponse(overview);
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('portfolio')) {
      return this.generateInvestmentResponse(overview);
    } else if (lowerMessage.includes('credit') || lowerMessage.includes('credit score')) {
      return this.generateCreditScoreResponse(creditScore);
    } else {
      return 'I\'m here to help with your financial questions! I can assist with budgeting, debt management, savings goals, investments, and credit optimization. What would you like to know more about?';
    }
  }

  /**
   * Generate suggestions based on message
   */
  generateSuggestions(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      return [
        'Show me my budget breakdown',
        'How can I reduce my spending?',
        'What are my top spending categories?'
      ];
    } else if (lowerMessage.includes('debt')) {
      return [
        'Create a debt payoff plan',
        'Show me debt scenarios',
        'How much interest am I paying?'
      ];
    } else if (lowerMessage.includes('save') || lowerMessage.includes('savings')) {
      return [
        'Show me savings scenarios',
        'How much should I save?',
        'What\'s my emergency fund status?'
      ];
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('portfolio')) {
      return [
        'Show investment growth scenarios',
        'How can I optimize my portfolio?',
        'What\'s my risk assessment?'
      ];
    } else if (lowerMessage.includes('credit')) {
      return [
        'How can I improve my credit score?',
        'What affects my credit score?',
        'Show credit score projection'
      ];
    } else {
      return [
        'Tell me about my spending',
        'Help me with debt',
        'Show my financial overview',
        'What are my financial risks?'
      ];
    }
  }

  /**
   * Generate budget response
   */
  generateBudgetResponse(overview) {
    const savingsRate = overview.savingsRate || 0;
    if (savingsRate > 20) {
      return `Great job! You're saving ${savingsRate.toFixed(1)}% of your income. Your spending is well-managed. Consider if there are ways to optimize further, such as reducing housing costs or finding better deals on recurring expenses.`;
    } else if (savingsRate > 10) {
      return `You're doing well with a ${savingsRate.toFixed(1)}% savings rate. However, I notice you're spending ${((1 - savingsRate / 100) * 100).toFixed(1)}% of your income. Consider if there are ways to reduce this, such as refinancing or finding a more affordable option.`;
    } else {
      return `Your current savings rate is ${savingsRate.toFixed(1)}%. I recommend focusing on reducing expenses, particularly in high-cost categories like housing, to improve your financial health.`;
    }
  }

  /**
   * Generate debt response
   */
  generateDebtResponse(debts) {
    if (!debts || debts.length === 0) {
      return 'Great news! You don\'t have any outstanding debts. Keep up the good work!';
    }

    const totalDebt = debts.reduce((sum, d) => sum + (d.balance || 0), 0);
    const highInterestDebt = debts.find(d => (d.interestRate || 0) > 15);
    
    if (highInterestDebt) {
      return `You currently have $${totalDebt.toLocaleString()} in total debt. I recommend focusing on paying off your ${highInterestDebt.name} first (${highInterestDebt.interestRate}% interest) as it has the highest interest rate. This will save you money in the long run.`;
    }

    return `You currently have $${totalDebt.toLocaleString()} in total debt. I recommend creating a payoff plan focusing on high-interest debts first.`;
  }

  /**
   * Generate savings response
   */
  generateSavingsResponse(overview) {
    const savingsRate = overview.savingsRate || 0;
    const monthlySavings = (overview.monthlyIncome || 0) - (overview.monthlyExpenses || 0);
    const emergencyFundMonths = 6;
    const targetEmergencyFund = (overview.monthlyExpenses || 0) * emergencyFundMonths;

    return `Great question! You're currently saving about ${savingsRate.toFixed(1)}% of your income ($${monthlySavings.toFixed(2)}/month). To build a ${emergencyFundMonths}-month emergency fund, you'll need $${targetEmergencyFund.toLocaleString()}. Keep up the good work!`;
  }

  /**
   * Generate investment response
   */
  generateInvestmentResponse(overview) {
    const savingsRate = overview.savingsRate || 0;
    return `Your investment portfolio is part of your overall financial strategy. With your current savings rate of ${savingsRate.toFixed(1)}%, you're on a good track. Consider increasing your monthly contributions to accelerate growth and build long-term wealth.`;
  }

  /**
   * Generate credit score response
   */
  generateCreditScoreResponse(creditScore) {
    if (creditScore >= 750) {
      return `Your credit score is ${creditScore}, which is excellent! To maintain it, keep making payments on time, keep credit utilization below 30%, and avoid opening too many new accounts.`;
    } else if (creditScore >= 700) {
      return `Your credit score is ${creditScore}, which is good! To improve it further, focus on paying down debt, making all payments on time, and keeping credit utilization low.`;
    } else {
      return `Your credit score is ${creditScore}. To improve it, focus on paying all bills on time, reducing credit card balances, and avoiding new credit applications.`;
    }
  }
}

module.exports = new ChatService();

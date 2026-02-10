const CalculationHelper = require('../utils/calculations');
const DateHelper = require('../utils/dateHelper');
const FinancialService = require('./FinancialService');
const ErrorCodes = require('../constants/errorCodes');

class AIService {
  /**
   * Generate AI insights
   * @param {number} userId - User ID
   * @returns {Promise<Object>} AI insights
   */
  async generateInsights(userId) {
    try {
      const overview = await FinancialService.getOverview(userId);
      const transactions = await FinancialService.getTransactions(userId, { limit: 100 });
      const debts = await FinancialService.getDebts(userId);
      const budgets = await FinancialService.getBudgets(userId);

      // Analyze spending patterns
      const spendingPatterns = this.analyzeSpendingPatterns(transactions.transactions);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(overview, debts, budgets);
      
      // Assess risk
      const riskAssessment = this.assessRisk(overview, debts);
      
      // Forecast cash flow
      const cashFlowForecast = this.forecastCashFlow(overview, transactions.transactions);

      return {
        spendingPatterns,
        recommendations,
        riskAssessment,
        cashFlowForecast
      };
    } catch (error) {
      const aiError = new Error(ErrorCodes.AI_PROCESSING_ERROR.message);
      aiError.code = ErrorCodes.AI_PROCESSING_ERROR.code;
      aiError.statusCode = ErrorCodes.AI_PROCESSING_ERROR.statusCode;
      throw aiError;
    }
  }

  /**
   * Generate financial twin data
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Financial twin data
   */
  async generateFinancialTwin(userId) {
    try {
      const overview = await FinancialService.getOverview(userId);
      const transactions = await FinancialService.getTransactions(userId, { limit: 100 });
      const debts = await FinancialService.getDebts(userId);

      // Analyze behavior profile
      const behaviorProfile = this.analyzeBehaviorProfile(overview, transactions.transactions);
      
      // Generate predictions
      const predictions = this.generatePredictions(overview, debts, transactions.transactions);
      
      // Generate personalized advice
      const personalizedAdvice = this.generatePersonalizedAdvice(overview, debts, behaviorProfile);

      return {
        behaviorProfile,
        predictions,
        personalizedAdvice
      };
    } catch (error) {
      const aiError = new Error(ErrorCodes.AI_PROCESSING_ERROR.message);
      aiError.code = ErrorCodes.AI_PROCESSING_ERROR.code;
      aiError.statusCode = ErrorCodes.AI_PROCESSING_ERROR.statusCode;
      throw aiError;
    }
  }

  /**
   * Analyze spending patterns
   * @param {Array} transactions - Transactions
   * @returns {Object} Spending patterns
   */
  analyzeSpendingPatterns(transactions) {
    const categoryTotals = {};
    let totalSpending = 0;

    transactions.forEach(transaction => {
      if (transaction.amount < 0) {
        const category = transaction.category;
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(transaction.amount);
        totalSpending += Math.abs(transaction.amount);
      }
    });

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      topCategories,
      trend: 'decreasing',
      message: 'Your spending has decreased by 5% compared to last month'
    };
  }

  /**
   * Generate recommendations
   * @param {Object} overview - Financial overview
   * @param {Array} debts - Debts
   * @param {Array} budgets - Budgets
   * @returns {Array} Recommendations
   */
  generateRecommendations(overview, debts, budgets) {
    const recommendations = [];

    // Debt recommendations
    if (debts.length > 0) {
      const highInterestDebt = debts.find(d => d.interestRate > 15);
      if (highInterestDebt) {
        recommendations.push({
          type: 'debt',
          priority: 'high',
          title: 'Pay Off High-Interest Debt',
          description: `Consider paying an extra $200/month on your ${highInterestDebt.name} to reduce interest`,
          impact: 'Save $450 in interest over 12 months'
        });
      }
    }

    // Budget recommendations
    const overBudget = budgets.find(b => b.spent > b.budget * 0.9);
    if (overBudget) {
      recommendations.push({
        type: 'budget',
        priority: 'high',
        title: `Optimize ${overBudget.category} Spending`,
        description: `You're approaching your ${overBudget.category} budget limit`,
        impact: 'Better budget management'
      });
    }

    // Emergency fund recommendation
    if (overview.savingsRate < 20) {
      recommendations.push({
        type: 'investment',
        priority: 'medium',
        title: 'Increase Emergency Fund',
        description: 'Your emergency fund covers 3 months. Aim for 6 months.',
        impact: 'Better financial security'
      });
    }

    return recommendations;
  }

  /**
   * Assess financial risk
   * @param {Object} overview - Financial overview
   * @param {Array} debts - Debts
   * @returns {Object} Risk assessment
   */
  assessRisk(overview, debts) {
    let riskScore = 0;
    const factors = [];

    // Debt-to-income ratio
    if (overview.monthlyIncome > 0) {
      const debtToIncome = (overview.totalDebt / (overview.monthlyIncome * 12)) * 100;
      if (debtToIncome > 40) {
        riskScore += 30;
        factors.push({ factor: 'High debt-to-income ratio', risk: 'high' });
      } else if (debtToIncome > 30) {
        riskScore += 20;
        factors.push({ factor: 'Moderate debt-to-income ratio', risk: 'medium' });
      }
    }

    // Credit utilization
    const creditCardDebt = debts.find(d => d.type === 'credit_card');
    if (creditCardDebt && creditCardDebt.balance > 0) {
      factors.push({ factor: 'Credit card debt present', risk: 'medium' });
      riskScore += 15;
    }

    // Emergency fund
    if (overview.savingsRate < 10) {
      riskScore += 20;
      factors.push({ factor: 'Low savings rate', risk: 'medium' });
    } else {
      factors.push({ factor: 'Good savings rate', risk: 'low' });
    }

    const level = riskScore >= 50 ? 'high' : riskScore >= 30 ? 'moderate' : 'low';

    return {
      score: Math.min(riskScore, 100),
      level,
      factors
    };
  }

  /**
   * Forecast cash flow
   * @param {Object} overview - Financial overview
   * @param {Array} transactions - Transactions
   * @returns {Object} Cash flow forecast
   */
  forecastCashFlow(overview, transactions) {
    const avgIncome = overview.monthlyIncome;
    const avgExpenses = overview.monthlyExpenses;

    return {
      nextMonth: {
        projectedIncome: avgIncome,
        projectedExpenses: avgExpenses,
        projectedBalance: avgIncome - avgExpenses
      },
      next3Months: {
        projectedIncome: avgIncome * 3,
        projectedExpenses: avgExpenses * 3,
        projectedBalance: (avgIncome - avgExpenses) * 3
      }
    };
  }

  /**
   * Analyze behavior profile
   * @param {Object} overview - Financial overview
   * @param {Array} transactions - Transactions
   * @returns {Object} Behavior profile
   */
  analyzeBehaviorProfile(overview, transactions) {
    const savingsRate = overview.savingsRate;
    let spendingPersonality = 'Moderate Spender';
    
    if (savingsRate > 30) {
      spendingPersonality = 'Aggressive Saver';
    } else if (savingsRate > 20) {
      spendingPersonality = 'Moderate Saver';
    } else if (savingsRate < 10) {
      spendingPersonality = 'Spender';
    }

    return {
      spendingPersonality,
      riskTolerance: 'Moderate',
      financialGoals: ['Emergency Fund', 'Debt Reduction', 'Retirement'],
      savingRate: Math.round(savingsRate)
    };
  }

  /**
   * Generate predictions
   * @param {Object} overview - Financial overview
   * @param {Array} debts - Debts
   * @param {Array} transactions - Transactions
   * @returns {Object} Predictions
   */
  generatePredictions(overview, debts, transactions) {
    const avgSpending = overview.monthlyExpenses;
    const avgSavings = overview.monthlyIncome - overview.monthlyExpenses;

    // Calculate debt payoff date
    let debtPayoffDate = null;
    if (debts.length > 0) {
      const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
      const avgPayment = debts.reduce((sum, d) => sum + d.minPayment, 0);
      // Simplified calculation
      const monthsToPayoff = Math.ceil(totalDebt / avgPayment);
      debtPayoffDate = DateHelper.addMonths(new Date(), monthsToPayoff);
    }

    return {
      nextMonthSpending: avgSpending,
      nextMonthSavings: avgSavings,
      creditScoreProjection: overview.creditScore + 10, // Simplified projection
      debtPayoffDate: debtPayoffDate ? DateHelper.toISOString(debtPayoffDate) : null
    };
  }

  /**
   * Generate personalized advice
   * @param {Object} overview - Financial overview
   * @param {Array} debts - Debts
   * @param {Object} behaviorProfile - Behavior profile
   * @returns {Array} Personalized advice
   */
  generatePersonalizedAdvice(overview, debts, behaviorProfile) {
    const advice = [];

    if (behaviorProfile.savingRate < 20) {
      advice.push('Your spending patterns suggest you can increase savings by 5%');
    }

    if (debts.length > 0) {
      const studentLoan = debts.find(d => d.name.includes('Student'));
      if (studentLoan) {
        advice.push('Consider refinancing your student loan to save on interest');
      }
    }

    if (overview.creditScore >= 750) {
      advice.push('Your credit score is excellent - maintain current payment habits');
    } else if (overview.creditScore >= 700) {
      advice.push('Your credit score is good - continue making on-time payments');
    }

    return advice;
  }
}

module.exports = new AIService();


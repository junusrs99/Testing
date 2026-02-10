const FinancialAccount = require('../models/FinancialAccount');
const Transaction = require('../models/Transaction');
const Debt = require('../models/Debt');
const CalculationHelper = require('../utils/calculations');
const DateHelper = require('../utils/dateHelper');
const ErrorCodes = require('../constants/errorCodes');

// Mock data storage (replace with database in production)
const financialData = {
  1: {
    accounts: [
      { id: 1, name: 'Checking Account', balance: 5420.50, type: 'checking' },
      { id: 2, name: 'Savings Account', balance: 15200.00, type: 'savings' },
      { id: 3, name: 'Investment Portfolio', balance: 28500.00, type: 'investment' }
    ],
    transactions: [
      { id: 1, date: '2024-01-15', amount: -150.00, category: 'Groceries', description: 'Supermarket' },
      { id: 2, date: '2024-01-14', amount: -75.50, category: 'Dining', description: 'Restaurant' },
      { id: 3, date: '2024-01-13', amount: 3000.00, category: 'Income', description: 'Salary' },
      { id: 4, date: '2024-01-12', amount: -1200.00, category: 'Housing', description: 'Rent' },
      { id: 5, date: '2024-01-11', amount: -45.00, category: 'Transportation', description: 'Gas' }
    ],
    creditScore: 750,
    debts: [
      { id: 1, name: 'Credit Card', balance: 2500.00, interestRate: 18.5, minPayment: 75.00 },
      { id: 2, name: 'Student Loan', balance: 15000.00, interestRate: 4.5, minPayment: 200.00 }
    ],
    budgets: [
      { category: 'Groceries', budget: 500, spent: 320 },
      { category: 'Dining', budget: 300, spent: 180 },
      { category: 'Transportation', budget: 200, spent: 145 },
      { category: 'Entertainment', budget: 150, spent: 95 }
    ]
  }
};

class FinancialService {
  /**
   * Get user accounts
   * @param {number} userId - User ID
   * @returns {Promise<Array>} User accounts
   */
  async getAccounts(userId) {
    const data = financialData[userId] || { accounts: [] };
    return data.accounts.map(acc => new FinancialAccount({ ...acc, userId }));
  }

  /**
   * Get user transactions
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Transactions with pagination
   */
  async getTransactions(userId, options = {}) {
    const { limit = 50, offset = 0, startDate, endDate, category } = options;
    const data = financialData[userId] || { transactions: [] };
    
    let transactions = data.transactions;

    // Filter by date range
    if (startDate || endDate) {
      transactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        if (startDate && transactionDate < new Date(startDate)) return false;
        if (endDate && transactionDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Filter by category
    if (category) {
      transactions = transactions.filter(t => t.category === category);
    }

    // Paginate
    const paginatedTransactions = transactions.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    return {
      transactions: paginatedTransactions.map(t => new Transaction({ ...t, userId })),
      total: transactions.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
  }

  /**
   * Get user debts
   * @param {number} userId - User ID
   * @returns {Promise<Array>} User debts
   */
  async getDebts(userId) {
    const data = financialData[userId] || { debts: [] };
    return data.debts.map(debt => new Debt({ ...debt, userId }));
  }

  /**
   * Get financial overview
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Financial overview
   */
  async getOverview(userId) {
    const data = financialData[userId] || {
      accounts: [],
      transactions: [],
      creditScore: 0,
      debts: [],
      budgets: []
    };

    const totalBalance = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalDebt = data.debts.reduce((sum, debt) => sum + debt.balance, 0);
    const netWorth = CalculationHelper.calculateNetWorth(totalBalance, totalDebt);
    
    const monthlyIncome = data.transactions
      .filter(t => t.category === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = data.transactions
      .filter(t => t.amount < 0 && t.category !== 'Income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const savingsRate = CalculationHelper.calculateSavingsRate(monthlyIncome, monthlyExpenses);

    return {
      totalBalance,
      totalDebt,
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      creditScore: data.creditScore,
      accountCount: data.accounts.length,
      transactionCount: data.transactions.length
    };
  }

  /**
   * Get budgets
   * @param {number} userId - User ID
   * @returns {Promise<Array>} User budgets
   */
  async getBudgets(userId) {
    const data = financialData[userId] || { budgets: [] };
    return data.budgets;
  }

  /**
   * Get credit score
   * @param {number} userId - User ID
   * @returns {Promise<number>} Credit score
   */
  async getCreditScore(userId) {
    const data = financialData[userId] || { creditScore: 0 };
    return data.creditScore;
  }
}

module.exports = new FinancialService();


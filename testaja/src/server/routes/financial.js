const express = require('express');
const router = express.Router();
const FinancialController = require('../controllers/FinancialController');
const { optionalAuth } = require('../middleware/auth');

// Get all financial accounts (public with optional auth)
router.get('/accounts', optionalAuth, FinancialController.getAccounts.bind(FinancialController));

// Get transactions (public with optional auth)
router.get('/transactions', optionalAuth, FinancialController.getTransactions.bind(FinancialController));

// Get credit score (public with optional auth)
router.get('/credit-score', optionalAuth, FinancialController.getCreditScore.bind(FinancialController));

// Get debts (public with optional auth)
router.get('/debts', optionalAuth, FinancialController.getDebts.bind(FinancialController));

// Get budgets (public with optional auth)
router.get('/budgets', optionalAuth, FinancialController.getBudgets.bind(FinancialController));

// Get financial overview (public with optional auth)
router.get('/overview', optionalAuth, FinancialController.getOverview.bind(FinancialController));

// Get portfolio (public with optional auth)
router.get('/portfolio', optionalAuth, FinancialController.getPortfolio.bind(FinancialController));

// Get holdings (public with optional auth)
router.get('/holdings', optionalAuth, FinancialController.getHoldings.bind(FinancialController));

// Get debt summary (public with optional auth)
router.get('/debt-summary', optionalAuth, FinancialController.getDebtSummary.bind(FinancialController));

module.exports = router;


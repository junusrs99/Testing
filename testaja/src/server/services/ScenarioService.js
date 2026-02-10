const CalculationHelper = require('../utils/calculations');
const DateHelper = require('../utils/dateHelper');
const FinancialService = require('./FinancialService');
const { ScenarioTypes, ScenarioConfig } = require('../constants/scenarioTypes');
const ErrorCodes = require('../constants/errorCodes');

class ScenarioService {
  /**
   * Simulate a financial scenario
   * @param {number} userId - User ID
   * @param {string} scenarioType - Scenario type
   * @param {Object} parameters - Scenario parameters
   * @returns {Promise<Object>} Scenario results
   */
  async simulateScenario(userId, scenarioType, parameters) {
    const { config } = ScenarioConfig[scenarioType];
    if (!config) {
      const error = new Error('Invalid scenario type');
      error.code = ErrorCodes.INVALID_INPUT.code;
      error.statusCode = ErrorCodes.INVALID_INPUT.statusCode;
      throw error;
    }

    const overview = await FinancialService.getOverview(userId);
    const debts = await FinancialService.getDebts(userId);

    switch (scenarioType) {
      case ScenarioTypes.SPENDING_INCREASE:
        return this.simulateSpendingIncrease(overview, parameters);
      case ScenarioTypes.DEBT_PAYOFF:
        return this.simulateDebtPayoff(overview, debts, parameters);
      case ScenarioTypes.INVESTMENT_GROWTH:
        return this.simulateInvestmentGrowth(overview, parameters);
      case ScenarioTypes.EMERGENCY_FUND:
        return this.simulateEmergencyFund(overview, parameters);
      default:
        const error = new Error('Scenario type not implemented');
        error.code = ErrorCodes.INVALID_INPUT.code;
        error.statusCode = ErrorCodes.INVALID_INPUT.statusCode;
        throw error;
    }
  }

  /**
   * Simulate spending increase scenario
   * @param {Object} overview - Financial overview
   * @param {Object} parameters - Scenario parameters
   * @returns {Object} Scenario results
   */
  simulateSpendingIncrease(overview, parameters) {
    const newAmount = parameters.newAmount || overview.monthlyExpenses * 1.1;
    const currentSavings = overview.monthlyIncome - overview.monthlyExpenses;
    const projectedSavings = overview.monthlyIncome - newAmount;

    return {
      scenario: 'Spending Increase',
      currentState: {
        monthlyExpenses: overview.monthlyExpenses,
        monthlySavings: currentSavings,
        monthsToGoal: currentSavings > 0 ? 24 : null
      },
      projectedState: {
        monthlyExpenses: newAmount,
        monthlySavings: projectedSavings,
        monthsToGoal: projectedSavings > 0 ? Math.ceil(24 * (overview.monthlyExpenses / newAmount)) : null,
        impact: projectedSavings < 0 ? 'Negative savings - goal achievement delayed' : 'Savings reduced'
      },
      recommendation: projectedSavings < 0 
        ? 'Consider a smaller increase or find offsetting savings'
        : 'Monitor spending to maintain savings goals'
    };
  }

  /**
   * Simulate debt payoff scenario
   * @param {Object} overview - Financial overview
   * @param {Array} debts - Debts
   * @param {Object} parameters - Scenario parameters
   * @returns {Object} Scenario results
   */
  simulateDebtPayoff(overview, debts, parameters) {
    const totalDebt = overview.totalDebt;
    const currentMonthlyPayment = debts.reduce((sum, d) => sum + d.minPayment, 0);
    const targetMonths = parameters.months || 24;
    const extraPayment = parameters.extraPayment || 0;
    const newMonthlyPayment = currentMonthlyPayment + extraPayment;

    // Simplified calculation
    const currentMonths = Math.ceil(totalDebt / currentMonthlyPayment);
    const currentInterest = totalDebt * 0.1; // Simplified
    const projectedInterest = totalDebt * 0.05; // Simplified

    return {
      scenario: 'Accelerated Debt Payoff',
      currentState: {
        totalDebt: totalDebt,
        monthsToPayoff: currentMonths,
        totalInterest: currentInterest,
        monthlyPayment: currentMonthlyPayment
      },
      projectedState: {
        totalDebt: totalDebt,
        monthsToPayoff: targetMonths,
        totalInterest: projectedInterest,
        monthlyPayment: newMonthlyPayment,
        savings: currentInterest - projectedInterest
      },
      recommendation: 'Accelerating payoff saves money in interest'
    };
  }

  /**
   * Simulate investment growth scenario
   * @param {Object} overview - Financial overview
   * @param {Object} parameters - Scenario parameters
   * @returns {Object} Scenario results
   */
  simulateInvestmentGrowth(overview, parameters) {
    const currentValue = 28500; // Mock current investment value
    const currentContribution = 500;
    const newContribution = parameters.newContribution || 750;
    const annualReturn = 0.07; // 7% annual return
    const years = 5;

    const currentProjected = CalculationHelper.compoundInterest(
      currentValue,
      annualReturn,
      years
    ) + (currentContribution * 12 * years);

    const newProjected = CalculationHelper.compoundInterest(
      currentValue,
      annualReturn,
      years
    ) + (newContribution * 12 * years);

    return {
      scenario: 'Investment Growth',
      currentState: {
        currentValue: currentValue,
        monthlyContribution: currentContribution,
        projectedValue5Years: Math.round(currentProjected)
      },
      projectedState: {
        currentValue: currentValue,
        monthlyContribution: newContribution,
        projectedValue5Years: Math.round(newProjected),
        additionalGrowth: Math.round(newProjected - currentProjected)
      },
      recommendation: 'Increasing contributions accelerates wealth building'
    };
  }

  /**
   * Simulate emergency fund scenario
   * @param {Object} overview - Financial overview
   * @param {Object} parameters - Scenario parameters
   * @returns {Object} Scenario results
   */
  simulateEmergencyFund(overview, parameters) {
    const currentFund = 15200; // Mock current emergency fund
    const monthlyExpenses = overview.monthlyExpenses;
    const targetMonths = parameters.targetMonths || 6;
    const targetFund = targetMonths * monthlyExpenses;
    const monthlyContribution = parameters.monthlyContribution || (targetFund - currentFund) / 3;
    const monthsToReach = Math.ceil((targetFund - currentFund) / monthlyContribution);

    return {
      scenario: 'Emergency Fund Build',
      currentState: {
        currentFund: currentFund,
        monthlyExpenses: monthlyExpenses,
        monthsCovered: currentFund / monthlyExpenses
      },
      projectedState: {
        targetFund: targetFund,
        monthsToReach: monthsToReach,
        monthlyContribution: monthlyContribution
      },
      recommendation: `Building ${targetMonths}-month emergency fund provides better security`
    };
  }

  /**
   * Get available scenario types
   * @returns {Array} Scenario types
   */
  getScenarioTypes() {
    return Object.values(ScenarioTypes).map(type => ({
      id: type,
      name: ScenarioConfig[type]?.name || type,
      description: ScenarioConfig[type]?.description || ''
    }));
  }
}

module.exports = new ScenarioService();


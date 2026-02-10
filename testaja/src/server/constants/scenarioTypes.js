// Scenario type definitions
const ScenarioTypes = {
  SPENDING_INCREASE: 'spending_increase',
  DEBT_PAYOFF: 'debt_payoff',
  INVESTMENT_GROWTH: 'investment_growth',
  EMERGENCY_FUND: 'emergency_fund',
  RETIREMENT_PLANNING: 'retirement_planning',
  MORTGAGE_REFINANCE: 'mortgage_refinance'
};

const ScenarioConfig = {
  [ScenarioTypes.SPENDING_INCREASE]: {
    name: 'Spending Increase',
    description: 'Simulate impact of increased spending',
    requiredParams: ['newAmount'],
    optionalParams: []
  },
  [ScenarioTypes.DEBT_PAYOFF]: {
    name: 'Accelerated Debt Payoff',
    description: 'See how extra payments affect debt payoff timeline',
    requiredParams: [],
    optionalParams: ['months', 'extraPayment']
  },
  [ScenarioTypes.INVESTMENT_GROWTH]: {
    name: 'Investment Growth',
    description: 'Project investment growth with different contribution levels',
    requiredParams: [],
    optionalParams: ['newContribution']
  },
  [ScenarioTypes.EMERGENCY_FUND]: {
    name: 'Emergency Fund Build',
    description: 'Plan your emergency fund strategy',
    requiredParams: [],
    optionalParams: ['targetMonths', 'monthlyContribution']
  }
};

module.exports = {
  ScenarioTypes,
  ScenarioConfig
};


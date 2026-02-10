// Mock data for development and default values

export const getDefaultOverview = () => ({
  totalBalance: 45230.50,
  netWorth: 125430.75,
  monthlyIncome: 8500.00,
  monthlyExpenses: 6200.00,
});

export const getDefaultInsights = () => ({
  recommendations: [
    {
      title: 'Increase Emergency Fund',
      description: 'Your emergency fund is below the recommended 3-6 months of expenses. Consider increasing it to $18,600.',
      impact: 'Could improve financial security by 25%',
      priority: 'high',
    },
    {
      title: 'Refinance High-Interest Debt',
      description: 'You have a credit card with 18% APR. Consider transferring to a card with 0% introductory APR.',
      impact: 'Could save $1,200 annually',
      priority: 'high',
    },
    {
      title: 'Maximize 401(k) Contribution',
      description: 'You\'re only contributing 5% to your 401(k). Consider increasing to 10% to maximize employer match.',
      impact: 'Could increase retirement savings by $3,400/year',
      priority: 'medium',
    },
  ],
  spendingPatterns: {
    topCategories: [
      { category: 'Housing', amount: 2500, percentage: 40 },
      { category: 'Food', amount: 1200, percentage: 19 },
      { category: 'Transportation', amount: 800, percentage: 13 },
      { category: 'Entertainment', amount: 600, percentage: 10 },
      { category: 'Utilities', amount: 400, percentage: 6 },
      { category: 'Other', amount: 700, percentage: 11 },
    ],
  },
  financialHealthScore: {
    overall: 72,
    savingsRate: 27,
    debtRatio: 35,
  },
  riskAssessment: {
    score: 45,
    level: 'moderate',
    factors: [
      { factor: 'Emergency Fund', risk: 'medium', description: 'Below recommended amount' },
      { factor: 'Debt-to-Income Ratio', risk: 'low', description: 'Within acceptable range' },
      { factor: 'Credit Utilization', risk: 'medium', description: 'Slightly above optimal' },
      { factor: 'Savings Rate', risk: 'low', description: 'Above average' },
    ],
  },
});

export const getDefaultFinancialTwin = () => ({
  behaviorProfile: {
    spendingPersonality: 'Conscious Spender',
    riskTolerance: 'Moderate',
    savingRate: 27,
    financialGoals: ['Emergency Fund', 'Retirement', 'Home Purchase'],
  },
  predictions: {
    nextMonthSpending: 6200,
    nextMonthSavings: 2300,
    creditScoreProjection: 745,
    debtPayoffDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 18).toISOString(),
  },
  personalizedAdvice: [
    'Consider automating your savings to reach your emergency fund goal faster',
    'Your spending on dining out has increased 15% this month - consider meal planning',
    'You\'re on track to pay off your credit card debt 3 months early if you maintain current payments',
  ],
});

export const getDefaultAccounts = () => [
  { _id: '1', name: 'Chase Checking', type: 'bank', institution: 'Chase Bank', balance: 15230.50, last4: '1234' },
  { _id: '2', name: 'Savings Account', type: 'bank', institution: 'Chase Bank', balance: 30000.00, last4: '5678' },
  { _id: '3', name: 'Credit Card', type: 'credit_card', institution: 'American Express', balance: 2450.00, last4: '9012' },
];

export const getDefaultTransactions = () => [
  { id: '1', description: 'Grocery Store', category: 'Food', date: '2024-01-15', amount: -125.50 },
  { id: '2', description: 'Salary Deposit', category: 'Income', date: '2024-01-10', amount: 8500.00 },
  { id: '3', description: 'Rent Payment', category: 'Housing', date: '2024-01-05', amount: -2500.00 },
  { id: '4', description: 'Gas Station', category: 'Transportation', date: '2024-01-14', amount: -65.00 },
  { id: '5', description: 'Restaurant', category: 'Food', date: '2024-01-13', amount: -85.50 },
  { id: '6', description: 'Netflix Subscription', category: 'Entertainment', date: '2024-01-12', amount: -15.99 },
  { id: '7', description: 'Electric Bill', category: 'Utilities', date: '2024-01-11', amount: -120.00 },
  { id: '8', description: 'Investment Return', category: 'Investment', date: '2024-01-09', amount: 450.00 },
];

export const getDefaultDebts = () => [
  {
    _id: '1',
    name: 'Credit Card',
    type: 'credit_card',
    balance: 2450.00,
    originalBalance: 5000.00,
    interestRate: 18.5,
    minimumPayment: 75.00,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    name: 'Car Loan',
    type: 'loan',
    balance: 18500.00,
    originalBalance: 25000.00,
    interestRate: 4.5,
    minimumPayment: 450.00,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const getDefaultDebtSummary = () => ({
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

export const getDefaultBudgets = () => [
  { category: 'Housing', budget: 3000, spent: 2500 },
  { category: 'Food', budget: 1500, spent: 1200 },
  { category: 'Transportation', budget: 1000, spent: 800 },
  { category: 'Entertainment', budget: 800, spent: 600 },
  { category: 'Utilities', budget: 500, spent: 400 },
];

export const getDefaultCreditData = () => ({
  score: 745,
  factors: [
    { name: 'Payment History', score: 95, description: 'Excellent payment record' },
    { name: 'Credit Utilization', score: 68, description: 'Using 32% of available credit' },
    { name: 'Credit History Length', score: 85, description: '8 years average account age' },
    { name: 'Credit Mix', score: 70, description: 'Good mix of credit types' },
    { name: 'New Credit', score: 80, description: 'Limited recent inquiries' },
  ],
  history: [
    { date: '2024-01-01', score: 742, change: 3, reason: 'On-time payment' },
    { date: '2023-12-01', score: 738, change: 4, reason: 'Reduced credit utilization' },
    { date: '2023-11-01', score: 735, change: 2, reason: 'Account age increased' },
  ],
});

export const getDefaultCreditRecommendations = () => [
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
];

export const getDefaultPortfolio = () => ({
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

export const getDefaultHoldings = () => [
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
  {
    _id: '4',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    quantity: 0.5,
    price: 42000.00,
    value: 21000.00,
    change: 5.2,
  },
  {
    _id: '5',
    symbol: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    type: 'bond',
    quantity: 200,
    price: 78.50,
    value: 15700.00,
    change: 0.3,
  },
];

export const getDefaultScenarios = () => [
  {
    id: 'spending_increase',
    name: 'Spending Increase',
    description: 'Simulate the impact of increasing monthly spending',
  },
  {
    id: 'debt_payoff',
    name: 'Debt Payoff Strategy',
    description: 'Calculate payoff timeline with extra payments',
  },
  {
    id: 'investment_growth',
    name: 'Investment Growth',
    description: 'Project portfolio growth with additional contributions',
  },
  {
    id: 'emergency_fund',
    name: 'Emergency Fund Goal',
    description: 'Plan your emergency fund savings timeline',
  },
  {
    id: 'retirement_planning',
    name: 'Retirement Planning',
    description: 'Calculate retirement savings needed',
  },
];

export const getDefaultAchievements = () => [
  {
    _id: '1',
    name: 'First Steps',
    description: 'Complete your profile setup',
    category: 'onboarding',
    points: 50,
    rarity: 'common',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    name: 'Savings Starter',
    description: 'Save your first $1,000',
    category: 'savings',
    points: 100,
    rarity: 'common',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    name: 'Debt Destroyer',
    description: 'Pay off your first debt',
    category: 'debt',
    points: 200,
    rarity: 'rare',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    name: 'Credit Champion',
    description: 'Achieve a credit score of 750+',
    category: 'credit',
    points: 300,
    rarity: 'rare',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    name: 'Millionaire Mindset',
    description: 'Reach $100,000 in net worth',
    category: 'savings',
    points: 500,
    rarity: 'epic',
    unlocked: false,
    progress: 125430,
    target: 100000,
  },
  {
    _id: '6',
    name: 'Investment Guru',
    description: 'Invest $50,000 in portfolio',
    category: 'investment',
    points: 400,
    rarity: 'epic',
    unlocked: false,
    progress: 125430,
    target: 50000,
  },
  {
    _id: '7',
    name: 'Perfect Payment',
    description: 'Make 12 consecutive on-time payments',
    category: 'credit',
    points: 250,
    rarity: 'rare',
    unlocked: false,
    progress: 8,
    target: 12,
  },
];

export const getDefaultAchievementStats = () => ({
  totalAchievements: 7,
  unlocked: 4,
  totalPoints: 650,
  level: 5,
  currentPoints: 650,
  pointsNeeded: 1000,
});

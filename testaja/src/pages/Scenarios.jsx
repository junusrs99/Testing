import { useEffect, useState } from 'react';
import axios from 'axios';
import { BranchesIcon, AlertCircleIcon } from '../components/Icons';
import { getDefaultScenarios } from '../utils/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Scenarios = () => {
  const [scenarioTypes, setScenarioTypes] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [parameters, setParameters] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScenarioTypes();
  }, []);

  const fetchScenarioTypes = async () => {
    try {
      const response = await axios.get('/api/scenarios/types').catch(() => ({
        data: { data: getDefaultScenarios() },
      }));
      setScenarioTypes(response.data.data || response.data || getDefaultScenarios());
    } catch (error) {
      console.error('Error fetching scenario types:', error);
      setScenarioTypes(getDefaultScenarios());
    }
  };

  const handleSimulate = async () => {
    if (!selectedScenario) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/scenarios/simulate', {
        scenario: selectedScenario.id,
        parameters,
      });
      setResult(response.data.data || response.data);
    } catch (error) {
      console.error('Error simulating scenario:', error);
      // Generate mock result
      setResult(generateMockResult(selectedScenario.id, parameters));
    } finally {
      setLoading(false);
    }
  };

  const generateMockResult = (scenarioId, params) => {
    switch (scenarioId) {
      case 'spending_increase':
        return {
          scenario: 'Spending Increase Analysis',
          currentState: {
            monthlySpending: 6200,
            monthlySavings: 2300,
            emergencyFund: 30000,
          },
          projectedState: {
            monthlySpending: params.newAmount || 7000,
            monthlySavings: 1500,
            emergencyFund: 30000,
            impact: `Increasing spending to $${params.newAmount || 7000}/month would reduce savings by $800/month`,
          },
          recommendation: 'Consider if this spending increase is necessary. If temporary, ensure you can return to previous spending levels.',
        };
      case 'debt_payoff':
        return {
          scenario: 'Debt Payoff Strategy',
          currentState: {
            totalDebt: 20950,
            monthlyPayment: 525,
            payoffMonths: 18,
            totalInterest: 2450,
          },
          projectedState: {
            totalDebt: 20950,
            monthlyPayment: (params.extraPayment || 0) + 525,
            payoffMonths: params.months || 12,
            totalInterest: 1200,
            savings: 'You would save $1,250 in interest',
          },
          recommendation: `By paying an extra $${params.extraPayment || 200}/month, you'll pay off your debt ${18 - (params.months || 12)} months earlier.`,
        };
      case 'investment_growth':
        return {
          scenario: 'Investment Growth Projection',
          currentState: {
            portfolioValue: 125430,
            monthlyContribution: 500,
            projectedValue5Years: 185000,
          },
          projectedState: {
            portfolioValue: 125430,
            monthlyContribution: params.newContribution || 750,
            projectedValue5Years: 225000,
            additionalGrowth: '$40,000 more in 5 years',
          },
          recommendation: 'Increasing your monthly contribution will significantly accelerate your wealth building.',
        };
      case 'emergency_fund':
        return {
          scenario: 'Emergency Fund Goal',
          currentState: {
            currentFund: 30000,
            monthlyContribution: 500,
            monthsToGoal: 0,
          },
          projectedState: {
            currentFund: 30000,
            targetFund: (params.targetMonths || 6) * 6200,
            monthlyContribution: params.monthlyContribution || 533,
            monthsToGoal: Math.ceil(((params.targetMonths || 6) * 6200 - 30000) / (params.monthlyContribution || 533)),
          },
          recommendation: `With $${params.monthlyContribution || 533}/month, you'll reach your ${params.targetMonths || 6}-month emergency fund goal in ${Math.ceil(((params.targetMonths || 6) * 6200 - 30000) / (params.monthlyContribution || 533))} months.`,
        };
      default:
        return {
          scenario: 'Scenario Analysis',
          currentState: {},
          projectedState: {},
          recommendation: 'Review the scenario parameters and results carefully.',
        };
    }
  };

  const handleParameterChange = (key, value) => {
    setParameters((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const getParameterInputs = () => {
    if (!selectedScenario) return null;

    switch (selectedScenario.id) {
      case 'spending_increase':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Monthly Spending Amount ($)
            </label>
            <input
              type="number"
              value={parameters.newAmount || ''}
              onChange={(e) => handleParameterChange('newAmount', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="3000"
            />
          </div>
        );
      case 'debt_payoff':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Payoff Months
              </label>
              <input
                type="number"
                value={parameters.months || ''}
                onChange={(e) => handleParameterChange('months', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Monthly Payment ($)
              </label>
              <input
                type="number"
                value={parameters.extraPayment || ''}
                onChange={(e) => handleParameterChange('extraPayment', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="200"
              />
            </div>
          </div>
        );
      case 'investment_growth':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Monthly Contribution ($)
            </label>
            <input
              type="number"
              value={parameters.newContribution || ''}
              onChange={(e) => handleParameterChange('newContribution', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="750"
            />
          </div>
        );
      case 'emergency_fund':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Months Coverage
              </label>
              <input
                type="number"
                value={parameters.targetMonths || ''}
                onChange={(e) => handleParameterChange('targetMonths', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Contribution ($)
              </label>
              <input
                type="number"
                value={parameters.monthlyContribution || ''}
                onChange={(e) => handleParameterChange('monthlyContribution', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="533"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Scenario Simulation</h1>
        <p className="text-gray-600 mt-1">Test different financial scenarios and see their impact</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BranchesIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Select Scenario</h2>
          </div>
          <div className="space-y-3">
            {scenarioTypes.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  setSelectedScenario(scenario);
                  setParameters({});
                  setResult(null);
                }}
                className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                  selectedScenario?.id === scenario.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
              </button>
            ))}
          </div>

          {selectedScenario && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Parameters</h3>
              {getParameterInputs()}
              <button
                onClick={handleSimulate}
                disabled={loading}
                className="w-full mt-6 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Simulation Results</h2>
          {result ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{result.scenario}</h3>
                
                {/* Current State */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current State</h4>
                  <div className="space-y-2">
                    {Object.entries(result.currentState || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium text-gray-900">
                          {typeof value === 'number' && (key.includes('Amount') || key.includes('Value') || key.includes('Debt') || key.includes('Interest') || key.includes('Savings') || key.includes('Payment') || key.includes('Fund') || key.includes('Spending'))
                            ? `$${value.toLocaleString()}`
                            : typeof value === 'number' && key.includes('Months')
                            ? `${value} months`
                            : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projected State */}
                <div className="mb-4 p-4 bg-primary-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Projected State</h4>
                  <div className="space-y-2">
                    {Object.entries(result.projectedState || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium text-gray-900">
                          {typeof value === 'number' && (key.includes('Amount') || key.includes('Value') || key.includes('Debt') || key.includes('Interest') || key.includes('Savings') || key.includes('Payment') || key.includes('Fund') || key.includes('Spending'))
                            ? `$${value.toLocaleString()}`
                            : typeof value === 'number' && key.includes('Months')
                            ? `${value} months`
                            : typeof value === 'string'
                            ? value
                            : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                {result.recommendation && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <p className="text-sm text-gray-900">{result.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BranchesIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a scenario and run simulation to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scenarios;

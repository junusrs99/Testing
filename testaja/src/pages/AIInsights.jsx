import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrainIcon, TrendingUpIcon, AlertCircleIcon, TrophyIcon, CheckIcon } from '../components/Icons';
import {
  getDefaultInsights,
  getDefaultFinancialTwin,
} from '../utils/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [financialTwin, setFinancialTwin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const [insightsRes, twinRes] = await Promise.all([
        axios.get('/api/ai/insights').catch(() => ({ data: { data: getDefaultInsights() } })),
        axios.get('/api/ai/financial-twin').catch(() => ({ data: { data: getDefaultFinancialTwin() } })),
      ]);
      setInsights(insightsRes.data.data || insightsRes.data || getDefaultInsights());
      setFinancialTwin(twinRes.data.data || twinRes.data || getDefaultFinancialTwin());
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights(getDefaultInsights());
      setFinancialTwin(getDefaultFinancialTwin());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Cash flow forecast data
  const cashFlowData = [
    { month: 'Current', income: 8500, expenses: 6200, balance: 2300 },
    { month: 'Next Month', income: 8500, expenses: 6200, balance: 2300 },
    { month: '3 Months', income: 25500, expenses: 18600, balance: 6900 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-600 mt-1">Personalized financial intelligence powered by AI</p>
      </div>

      {/* Financial Twin */}
      {financialTwin && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BrainIcon className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Your Financial Twin</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Spending Personality</p>
              <p className="text-lg font-semibold text-gray-900">
                {financialTwin.behaviorProfile?.spendingPersonality || 'Balanced'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Risk Tolerance</p>
              <p className="text-lg font-semibold text-gray-900">
                {financialTwin.behaviorProfile?.riskTolerance || 'Moderate'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Saving Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {financialTwin.behaviorProfile?.savingRate || 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Financial Goals</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {financialTwin.behaviorProfile?.financialGoals?.map((goal, index) => (
                  <span key={index} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-primary-700">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions */}
      {financialTwin?.predictions && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUpIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">AI Predictions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Next Month Spending</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ${financialTwin.predictions.nextMonthSpending?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Next Month Savings</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${financialTwin.predictions.nextMonthSavings?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Credit Score Projection</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {financialTwin.predictions.creditScoreProjection || '0'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Debt Payoff Date</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {financialTwin.predictions.debtPayoffDate
                  ? new Date(financialTwin.predictions.debtPayoffDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow Forecast */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cash Flow Forecast</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" name="Income" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
            <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Balance" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Assessment */}
      {insights?.riskAssessment && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircleIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Risk Assessment</h2>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Risk Score</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                insights.riskAssessment.level === 'low' ? 'bg-green-100 text-green-700' :
                insights.riskAssessment.level === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {insights.riskAssessment.score}/100 - {insights.riskAssessment.level}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  insights.riskAssessment.level === 'low' ? 'bg-green-500' :
                  insights.riskAssessment.level === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${insights.riskAssessment.score}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.riskAssessment.factors?.map((factor, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-900 font-medium">{factor.factor}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    factor.risk === 'low' ? 'bg-green-100 text-green-700' :
                    factor.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {factor.risk} risk
                  </span>
                </div>
                <p className="text-xs text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {insights?.recommendations && insights.recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrophyIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Personalized Recommendations</h2>
          </div>
          <div className="space-y-4">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      rec.priority === 'high' ? 'bg-red-50' :
                      rec.priority === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
                    }`}>
                      <AlertCircleIcon className={`h-5 w-5 ${
                        rec.priority === 'high' ? 'text-red-600' :
                        rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      <p className="text-sm text-primary-600 mt-2 font-medium">{rec.impact}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {rec.priority} priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Advice */}
      {financialTwin?.personalizedAdvice && financialTwin.personalizedAdvice.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personalized Action Plan</h2>
          <div className="space-y-3">
            {financialTwin.personalizedAdvice.map((advice, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-primary-50 rounded-lg">
                <CheckIcon className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-900">{advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;

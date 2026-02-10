import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  WalletIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DollarIcon,
  AlertCircleIcon,
  TrophyIcon,
} from '../components/Icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getDefaultOverview,
  getDefaultInsights,
} from '../utils/mockData';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, insightsRes] = await Promise.all([
        axios.get('/api/financial/overview').catch(() => ({ data: { data: getDefaultOverview() } })),
        axios.get('/api/ai/insights').catch(() => ({ data: { data: getDefaultInsights() } })),
      ]);
      setOverview(overviewRes.data.data || overviewRes.data || getDefaultOverview());
      setInsights(insightsRes.data.data || insightsRes.data || getDefaultInsights());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use default data on error
      setOverview(getDefaultOverview());
      setInsights(getDefaultInsights());
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

  const chartData = insights?.spendingPatterns?.topCategories?.map((cat) => ({
    name: cat.category,
    amount: cat.amount,
    percentage: cat.percentage,
  })) || [];

  const monthlyData = [
    { month: 'Oct', income: 8500, expenses: 6200 },
    { month: 'Nov', income: 8500, expenses: 6100 },
    { month: 'Dec', income: 8500, expenses: 6400 },
    { month: 'Jan', income: 8500, expenses: 6200 },
  ];

  const statCards = [
    {
      title: 'Total Balance',
      value: `$${overview?.totalBalance?.toLocaleString() || '0'}`,
      icon: WalletIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Net Worth',
      value: `$${overview?.netWorth?.toLocaleString() || '0'}`,
      icon: TrendingUpIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Monthly Income',
      value: `$${overview?.monthlyIncome?.toLocaleString() || '0'}`,
      icon: DollarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Monthly Expenses',
      value: `$${overview?.monthlyExpenses?.toLocaleString() || '0'}`,
      icon: TrendingDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const recommendations = insights?.recommendations?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Your financial overview at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Cash Flow</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#0ea5e9" name="Income" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Spending by Category</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No spending data available</div>
          )}
        </div>
      </div>

      {/* Financial Health Score */}
      {insights?.financialHealthScore && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Health Score</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Score</span>
                  <span className="text-lg font-bold text-gray-900">
                    {insights.financialHealthScore.overall}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      insights.financialHealthScore.overall >= 80
                        ? 'bg-green-500'
                        : insights.financialHealthScore.overall >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${insights.financialHealthScore.overall}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${insights.financialHealthScore.savingsRate || 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{insights.financialHealthScore.savingsRate || 0}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Debt Ratio</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${insights.financialHealthScore.debtRatio || 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{insights.financialHealthScore.debtRatio || 0}%</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                <TrophyIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Excellent Credit Score</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Growing Savings</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                <AlertCircleIcon className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">Review Expenses</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertCircleIcon className="h-5 w-5 text-primary-600" />
            <span>Top Recommendations</span>
          </h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    rec.priority === 'high'
                      ? 'bg-red-50'
                      : rec.priority === 'medium'
                      ? 'bg-yellow-50'
                      : 'bg-blue-50'
                  }`}
                >
                  <AlertCircleIcon
                    className={`h-5 w-5 ${
                      rec.priority === 'high'
                        ? 'text-red-600'
                        : rec.priority === 'medium'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        rec.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  <p className="text-sm text-primary-600 mt-2 font-medium">{rec.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => (window.location.href = '/accounts')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors text-center"
          >
            <DollarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Connect Account</div>
          </button>
          <button
            onClick={() => (window.location.href = '/scenarios')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors text-center"
          >
            <TrendingUpIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Run Scenario</div>
          </button>
          <button
            onClick={() => (window.location.href = '/chat')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors text-center"
          >
            <AlertCircleIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Ask AI</div>
          </button>
          <button
            onClick={() => (window.location.href = '/insights')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors text-center"
          >
            <TrophyIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">View Insights</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCardIcon, TrendingUpIcon, AlertCircleIcon, TrophyIcon, CheckIcon } from '../components/Icons';
import { getDefaultCreditData, getDefaultCreditRecommendations } from '../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CreditOptimization = () => {
  const [creditData, setCreditData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreditData();
  }, []);

  const fetchCreditData = async () => {
    try {
      const [creditRes, recommendationsRes] = await Promise.all([
        axios.get('/api/financial/credit-score').catch(() => ({ data: { data: getDefaultCreditData() } })),
        axios.get('/api/ai/credit-recommendations').catch(() => ({ data: { data: getDefaultCreditRecommendations() } })),
      ]);
      setCreditData(creditRes.data.data || creditRes.data || getDefaultCreditData());
      setRecommendations(recommendationsRes.data.data || recommendationsRes.data || getDefaultCreditRecommendations());
    } catch (error) {
      console.error('Error fetching credit data:', error);
      setCreditData(getDefaultCreditData());
      setRecommendations(getDefaultCreditRecommendations());
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

  const creditScore = creditData?.score || 0;
  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  const factorData = creditData?.factors?.map((f) => ({
    factor: f.name,
    score: f.score,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Credit Optimization</h1>
        <p className="text-gray-600 mt-1">Improve your credit score with AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Your Credit Score</p>
            <div className="relative inline-block">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={creditScore >= 750 ? '#10b981' : creditScore >= 700 ? '#3b82f6' : creditScore >= 650 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(creditScore / 850) * 552.92} 552.92`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className={`text-4xl font-bold ${getScoreColor(creditScore)}`}>{creditScore}</p>
                  <p className={`text-sm mt-1 ${getScoreColor(creditScore)}`}>{getScoreLabel(creditScore)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Breakdown</h2>
          <div className="space-y-4">
            {(creditData?.factors || []).map((factor, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{factor.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      factor.score >= 80 ? 'bg-green-500' : factor.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credit Factors Impact Chart */}
      {factorData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Credit Factors Impact</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={factorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="factor" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrophyIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Optimization Recommendations</h2>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
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
                      <p className="text-sm text-green-600 mt-2 font-medium">Potential Impact: {rec.impact}</p>
                      {rec.action && (
                        <button className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                          {rec.action} →
                        </button>
                      )}
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

      {/* Credit Score History */}
      {creditData?.history && creditData.history.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Credit Score History</h2>
          <div className="space-y-3">
            {creditData.history.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{entry.date}</p>
                  <p className="text-sm text-gray-600">{entry.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{entry.score}</p>
                  {entry.change !== 0 && (
                    <p className={`text-sm ${
                      entry.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.change >= 0 ? '+' : ''}{entry.change} points
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credit Score Tips */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Credit Score Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckIcon className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 mb-1">Pay Bills On Time</p>
                <p className="text-sm text-green-700">Payment history is the most important factor. Set up automatic payments to never miss a due date.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Keep Credit Utilization Low</p>
                <p className="text-sm text-blue-700">Try to keep your credit card balances below 30% of your credit limits to improve your score.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Don't Close Old Accounts</p>
                <p className="text-sm text-yellow-700">The length of your credit history matters. Keep old accounts open, even if you don't use them.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckIcon className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-semibold text-purple-900 mb-1">Limit New Credit Applications</p>
                <p className="text-sm text-purple-700">Too many hard inquiries in a short time can lower your score. Only apply for credit when necessary.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score Ranges */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Understanding Credit Scores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border-2 border-red-300 rounded-lg text-center bg-red-50">
            <p className="text-lg font-bold text-red-600">300-579</p>
            <p className="text-sm text-red-700 mt-1">Poor</p>
          </div>
          <div className="p-4 border-2 border-yellow-300 rounded-lg text-center bg-yellow-50">
            <p className="text-lg font-bold text-yellow-600">580-669</p>
            <p className="text-sm text-yellow-700 mt-1">Fair</p>
          </div>
          <div className="p-4 border-2 border-blue-300 rounded-lg text-center bg-blue-50">
            <p className="text-lg font-bold text-blue-600">670-739</p>
            <p className="text-sm text-blue-700 mt-1">Good</p>
          </div>
          <div className="p-4 border-2 border-green-300 rounded-lg text-center bg-green-50">
            <p className="text-lg font-bold text-green-600">740-850</p>
            <p className="text-sm text-green-700 mt-1">Excellent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditOptimization;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FundIcon, TrendingUpIcon, TrendingDownIcon, PlusIcon } from '../components/Icons';
import { getDefaultPortfolio, getDefaultHoldings } from '../utils/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHolding, setNewHolding] = useState({ symbol: '', name: '', type: 'stock', quantity: 0, price: 0 });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const [portfolioRes, holdingsRes] = await Promise.all([
        axios.get('/api/financial/portfolio').catch(() => ({ data: { data: getDefaultPortfolio() } })),
        axios.get('/api/financial/holdings').catch(() => ({ data: { data: getDefaultHoldings() } })),
      ]);
      setPortfolio(portfolioRes.data.data || portfolioRes.data || getDefaultPortfolio());
      setHoldings(holdingsRes.data.data || holdingsRes.data || getDefaultHoldings());
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setPortfolio(getDefaultPortfolio());
      setHoldings(getDefaultHoldings());
    } finally {
      setLoading(false);
    }
  };

  const handleAddHolding = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/financial/holdings', newHolding);
      setShowAddModal(false);
      setNewHolding({ symbol: '', name: '', type: 'stock', quantity: 0, price: 0 });
      fetchPortfolio();
    } catch (error) {
      // Add to local state for demo
      const holding = {
        ...newHolding,
        _id: Date.now().toString(),
        value: newHolding.quantity * newHolding.price,
        change: (Math.random() * 10 - 5).toFixed(2),
      };
      setHoldings([...holdings, holding]);
      setShowAddModal(false);
      setNewHolding({ symbol: '', name: '', type: 'stock', quantity: 0, price: 0 });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const pieData = holdings.map((h) => ({ name: h.symbol, value: h.value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const totalValue = portfolio?.totalValue || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your investments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Holding</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${portfolio?.totalValue?.toLocaleString() || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Gain/Loss</p>
          <p className={`text-2xl font-bold mt-2 ${
            (portfolio?.totalGain || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${portfolio?.totalGain?.toLocaleString() || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Gain/Loss %</p>
          <p className={`text-2xl font-bold mt-2 ${
            (portfolio?.totalGainPercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {portfolio?.totalGainPercent?.toFixed(2) || '0.00'}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Number of Holdings</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{holdings.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Allocation</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No holdings yet</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Asset Distribution</h2>
          <div className="space-y-3">
            {holdings.map((holding) => {
              const percentage = (holding.value / totalValue) * 100;
              return (
                <div key={holding._id}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{holding.symbol}</span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded capitalize">
                        {holding.type}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {portfolio?.performance && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">1 Day</p>
              <p className={`text-xl font-bold ${
                (portfolio.performance.day1 || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(portfolio.performance.day1 || 0) >= 0 ? '+' : ''}{portfolio.performance.day1?.toFixed(2) || '0.00'}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">1 Week</p>
              <p className={`text-xl font-bold ${
                (portfolio.performance.week1 || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(portfolio.performance.week1 || 0) >= 0 ? '+' : ''}{portfolio.performance.week1?.toFixed(2) || '0.00'}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">1 Month</p>
              <p className={`text-xl font-bold ${
                (portfolio.performance.month1 || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(portfolio.performance.month1 || 0) >= 0 ? '+' : ''}{portfolio.performance.month1?.toFixed(2) || '0.00'}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">1 Year</p>
              <p className={`text-xl font-bold ${
                (portfolio.performance.year1 || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(portfolio.performance.year1 || 0) >= 0 ? '+' : ''}{portfolio.performance.year1?.toFixed(2) || '0.00'}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Holdings Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Holdings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {holdings.map((holding) => (
                <tr key={holding._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-semibold text-gray-900">{holding.symbol}</p>
                      <p className="text-sm text-gray-500">{holding.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded capitalize">
                      {holding.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {holding.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    ${holding.price?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                    ${holding.value?.toLocaleString() || '0.00'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-semibold ${
                    (holding.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(holding.change || 0) >= 0 ? '+' : ''}{holding.change?.toFixed(2) || '0.00'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Holding</h2>
            <form onSubmit={handleAddHolding} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                <input
                  type="text"
                  value={newHolding.symbol}
                  onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  value={newHolding.name}
                  onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newHolding.type}
                  onChange={(e) => setNewHolding({ ...newHolding, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="stock">Stock</option>
                  <option value="bond">Bond</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="etf">ETF</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newHolding.quantity}
                    onChange={(e) => setNewHolding({ ...newHolding, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Share</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newHolding.price}
                    onChange={(e) => setNewHolding({ ...newHolding, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Add Holding
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;

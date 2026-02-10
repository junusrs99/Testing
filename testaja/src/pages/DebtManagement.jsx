import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCardIcon, DollarIcon, PlusIcon, CheckIcon } from '../components/Icons';
import { getDefaultDebts, getDefaultDebtSummary } from '../utils/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DebtManagement = () => {
  const [debts, setDebts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDebt, setNewDebt] = useState({
    name: '',
    type: 'credit_card',
    balance: 0,
    originalBalance: 0,
    interestRate: 0,
    minimumPayment: 0,
    dueDate: '',
  });

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const [debtsRes, summaryRes] = await Promise.all([
        axios.get('/api/financial/debts').catch(() => ({ data: { data: getDefaultDebts() } })),
        axios.get('/api/financial/debt-summary').catch(() => ({ data: { data: getDefaultDebtSummary() } })),
      ]);
      setDebts(debtsRes.data.data || debtsRes.data || getDefaultDebts());
      setSummary(summaryRes.data.data || summaryRes.data || getDefaultDebtSummary());
    } catch (error) {
      console.error('Error fetching debts:', error);
      setDebts(getDefaultDebts());
      setSummary(getDefaultDebtSummary());
    } finally {
      setLoading(false);
    }
  };

  const handleAddDebt = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/financial/debts', newDebt);
      setShowAddModal(false);
      setNewDebt({
        name: '',
        type: 'credit_card',
        balance: 0,
        originalBalance: 0,
        interestRate: 0,
        minimumPayment: 0,
        dueDate: '',
      });
      fetchDebts();
    } catch (error) {
      // Add to local state for demo
      const debt = {
        ...newDebt,
        _id: Date.now().toString(),
        dueDate: newDebt.dueDate || new Date().toISOString(),
      };
      setDebts([...debts, debt]);
      setShowAddModal(false);
      setNewDebt({
        name: '',
        type: 'credit_card',
        balance: 0,
        originalBalance: 0,
        interestRate: 0,
        minimumPayment: 0,
        dueDate: '',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Payoff timeline data
  const payoffData = debts
    .filter((debt) => debt.payoffDate || debt.originalBalance)
    .map((debt, index) => ({
      month: `Month ${index + 1}`,
      balance: debt.balance || 0,
      name: debt.name,
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debt Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your debts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Debt</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Debt</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ${summary?.totalDebt?.toLocaleString() || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Monthly Payments</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            ${summary?.totalMonthlyPayment?.toLocaleString() || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Avg Interest Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {summary?.averageInterestRate?.toFixed(2) || '0.00'}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Est. Payoff Date</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {summary?.estimatedPayoffDate
              ? new Date(summary.estimatedPayoffDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Debt Payoff Strategy */}
      {summary?.strategy && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Payoff Strategy</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="font-medium text-blue-900">{summary.strategy.method}</p>
            <p className="text-sm text-blue-700 mt-1">{summary.strategy.description}</p>
          </div>
          <div className="space-y-3">
            {summary.strategy.steps?.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <CheckIcon className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{step.debt}</p>
                  <p className="text-sm text-gray-600">{step.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debt Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Debt Progress</h2>
          <div className="space-y-4">
            {debts.map((debt) => {
              const progress = ((debt.originalBalance - debt.balance) / debt.originalBalance) * 100;
              return (
                <div key={debt._id}>
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{debt.name}</p>
                      <p className="text-xs text-gray-500">{debt.type}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      ${debt.balance?.toLocaleString()} / ${debt.originalBalance?.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% paid off</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payoff Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payoff Timeline</h2>
          {payoffData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={payoffData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No payoff data available</p>
          )}
        </div>
      </div>

      {/* All Debts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Debts</h2>
        <div className="space-y-4">
          {debts.map((debt) => {
            const progress = ((debt.originalBalance - debt.balance) / debt.originalBalance) * 100;
            return (
              <div key={debt._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{debt.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{debt.type?.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      ${debt.balance?.toLocaleString() || '0.00'}
                    </p>
                    <p className="text-sm text-gray-500">
                      of ${debt.originalBalance?.toLocaleString() || '0.00'}
                    </p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-gray-600">Interest Rate</p>
                    <p className="font-semibold text-gray-900">{debt.interestRate || 0}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Min Payment</p>
                    <p className="font-semibold text-gray-900">${debt.minimumPayment || debt.minPayment || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-semibold text-gray-900">
                      {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Debt Reduction Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-900 mb-1">Pay High-Interest Debts First</p>
            <p className="text-sm text-green-700">Focus on paying off debts with the highest interest rates to save money over time.</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-semibold text-blue-900 mb-1">Make More Than Minimum Payments</p>
            <p className="text-sm text-blue-700">Paying more than the minimum can significantly reduce your payoff time and interest paid.</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-semibold text-yellow-900 mb-1">Consider Debt Consolidation</p>
            <p className="text-sm text-yellow-700">Consolidating multiple debts into one loan with a lower interest rate can simplify payments.</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="font-semibold text-purple-900 mb-1">Track Your Progress</p>
            <p className="text-sm text-purple-700">Regularly monitoring your debt reduction progress helps you stay motivated and on track.</p>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Debt</h2>
            <form onSubmit={handleAddDebt} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Debt Name</label>
                <input
                  type="text"
                  value={newDebt.name}
                  onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Debt Type</label>
                <select
                  value={newDebt.type}
                  onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="loan">Loan</option>
                  <option value="mortgage">Mortgage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDebt.balance}
                    onChange={(e) => setNewDebt({ ...newDebt, balance: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDebt.originalBalance}
                    onChange={(e) => setNewDebt({ ...newDebt, originalBalance: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDebt.interestRate}
                    onChange={(e) => setNewDebt({ ...newDebt, interestRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Payment</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDebt.minimumPayment}
                    onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDebt.dueDate}
                  onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Add Debt
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

export default DebtManagement;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { WalletIcon, CreditCardIcon } from '../components/Icons';
import {
  getDefaultAccounts,
  getDefaultTransactions,
  getDefaultDebts,
  getDefaultBudgets,
  getDefaultCreditData,
} from '../utils/mockData';

const FinancialOverview = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [debts, setDebts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [creditScore, setCreditScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const [accountsRes, transactionsRes, debtsRes, budgetsRes, creditRes] = await Promise.all([
        axios.get('/api/financial/accounts').catch(() => ({ data: { data: getDefaultAccounts() } })),
        axios.get('/api/financial/transactions').catch(() => ({ data: { data: { transactions: getDefaultTransactions() } } })),
        axios.get('/api/financial/debts').catch(() => ({ data: { data: getDefaultDebts() } })),
        axios.get('/api/financial/budgets').catch(() => ({ data: { data: getDefaultBudgets() } })),
        axios.get('/api/financial/credit-score').catch(() => ({ data: { data: getDefaultCreditData() } })),
      ]);
      setAccounts((accountsRes.data.data || accountsRes.data) || getDefaultAccounts());
      const transactionsData = transactionsRes.data.data || transactionsRes.data;
      setTransactions(transactionsData?.transactions || transactionsData || getDefaultTransactions());
      setDebts((debtsRes.data.data || debtsRes.data) || getDefaultDebts());
      setBudgets((budgetsRes.data.data || budgetsRes.data) || getDefaultBudgets());
      const creditData = creditRes.data.data || creditRes.data;
      setCreditScore(creditData?.score || creditData || getDefaultCreditData().score);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      // Use defaults on error
      setAccounts(getDefaultAccounts());
      setTransactions(getDefaultTransactions());
      setDebts(getDefaultDebts());
      setBudgets(getDefaultBudgets());
      setCreditScore(getDefaultCreditData().score);
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

  const getCreditScoreColor = (score) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  const totalAccountBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const totalDebtAmount = debts.reduce((sum, debt) => sum + (debt.balance || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
        <p className="text-gray-600 mt-1">Complete view of your financial accounts and transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Accounts</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">${totalAccountBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Debt</p>
          <p className="text-2xl font-bold text-red-600 mt-2">${totalDebtAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Net Worth</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ${(totalAccountBalance - totalDebtAmount).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Credit Score</p>
          <p className={`text-2xl font-bold mt-2 ${getCreditScoreColor(creditScore)}`}>
            {creditScore}
          </p>
          <p className="text-sm text-gray-500 mt-1">{getCreditScoreLabel(creditScore)}</p>
        </div>
      </div>

      {/* Credit Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Credit Score</h2>
            <p className="text-sm text-gray-600 mt-1">Your current credit rating</p>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-bold ${getCreditScoreColor(creditScore)}`}>
              {creditScore}
            </p>
            <p className="text-sm text-gray-600 mt-1">{getCreditScoreLabel(creditScore)}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">300</span>
            <span className="text-gray-600">850</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                creditScore >= 750 ? 'bg-green-500' :
                creditScore >= 700 ? 'bg-blue-500' :
                creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${((creditScore - 300) / 550) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Accounts */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <WalletIcon className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Accounts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div key={account.id || account._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{account.name}</p>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded capitalize">
                  {account.type}
                </span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                ${account.balance?.toLocaleString() || '0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">{account.institution}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budgets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Budgets</h2>
        <div className="space-y-4">
          {budgets.map((budget, index) => {
            const percentage = Math.min((budget.spent / budget.budget) * 100, 100);
            const status = percentage >= 90 ? 'bg-red-500' : percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500';
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{budget.category}</span>
                  <span className="text-sm text-gray-600">
                    ${budget.spent?.toLocaleString() || '0'} / ${budget.budget?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${status}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {percentage.toFixed(1)}% used • ${(budget.budget - budget.spent)?.toLocaleString() || '0'} remaining
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Debts */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCardIcon className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Debts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {debts.map((debt) => (
            <div key={debt.id || debt._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{debt.name}</p>
                <p className="text-xl font-semibold text-red-600">
                  ${debt.balance?.toLocaleString() || '0.00'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div>
                  <p className="text-gray-600">Interest Rate</p>
                  <p className="font-medium text-gray-900">{debt.interestRate || 0}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Min Payment</p>
                  <p className="font-medium text-gray-900">${debt.minPayment || debt.minimumPayment || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 10).map((transaction, index) => (
                <tr key={transaction.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                    transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;

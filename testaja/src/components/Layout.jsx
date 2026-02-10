import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  DashboardIcon,
  WalletIcon,
  BrainIcon,
  BranchesIcon,
  MessageIcon,
  LogOutIcon,
  FundIcon,
  CreditCardIcon,
  LinkIcon,
  TrophyIcon,
  SettingsIcon,
} from './Icons';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { name: 'Financial Overview', href: '/overview', icon: WalletIcon },
    { name: 'AI Insights', href: '/insights', icon: BrainIcon },
    { name: 'Scenarios', href: '/scenarios', icon: BranchesIcon },
    { name: 'Portfolio', href: '/portfolio', icon: FundIcon },
    { name: 'Debt Management', href: '/debt', icon: CreditCardIcon },
    { name: 'Credit Optimization', href: '/credit', icon: CreditCardIcon },
    { name: 'Account Integration', href: '/accounts', icon: LinkIcon },
    { name: 'Achievements', href: '/achievements', icon: TrophyIcon },
    { name: 'AI Chat', href: '/chat', icon: MessageIcon },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-200 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white font-bold">
                F
              </div>
              {!collapsed && (
                <span className="text-xl font-bold text-primary-600">Fintech AI</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-700 font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOutIcon className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-200 ${collapsed ? 'pl-20' : 'pl-64'}`}>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

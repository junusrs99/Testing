import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FinancialOverview from './pages/FinancialOverview';
import AIInsights from './pages/AIInsights';
import Scenarios from './pages/Scenarios';
import Chat from './pages/Chat';
import AccountIntegration from './pages/AccountIntegration';
import Portfolio from './pages/Portfolio';
import DebtManagement from './pages/DebtManagement';
import CreditOptimization from './pages/CreditOptimization';
import Settings from './pages/Settings';
import Achievements from './pages/Achievements';
import Layout from './components/Layout';

// Public route wrapper - allows access without login but shows default data
const PublicRoute = ({ children }) => {
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Public routes - accessible without login */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Layout />
              </PublicRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="overview" element={<FinancialOverview />} />
            <Route path="insights" element={<AIInsights />} />
            <Route path="scenarios" element={<Scenarios />} />
            <Route path="chat" element={<Chat />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="debt" element={<DebtManagement />} />
            <Route path="credit" element={<CreditOptimization />} />
            <Route path="achievements" element={<Achievements />} />
          </Route>

          {/* Private routes - require login */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="accounts" element={<AccountIntegration />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

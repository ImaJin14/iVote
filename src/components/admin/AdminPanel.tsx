import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from './Dashboard';
import CompetitionManagement from './CompetitionManagement';
import ContestantManagement from './ContestantManagement';
import VoteAnalytics from './VoteAnalytics';
import TransactionLogs from './TransactionLogs';
import { 
  LayoutDashboard, 
  Trophy,
  Users, 
  BarChart3, 
  Receipt, 
  LogOut,
  Vote
} from 'lucide-react';

const AdminPanel = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { path: '', label: 'Dashboard', icon: LayoutDashboard },
    { path: 'competitions', label: 'Competitions', icon: Trophy },
    { path: 'contestants', label: 'Contestants', icon: Users },
    { path: 'analytics', label: 'Analytics', icon: BarChart3 },
    { path: 'transactions', label: 'Transactions', icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Vote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">iVote Admin</h1>
            <p className="text-sm text-gray-600">Control Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={`/admin/${item.path}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <Routes>
          <Route path="" element={<Dashboard />} />
          <Route path="competitions" element={<CompetitionManagement />} />
          <Route path="contestants" element={<ContestantManagement />} />
          <Route path="analytics" element={<VoteAnalytics />} />
          <Route path="transactions" element={<TransactionLogs />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
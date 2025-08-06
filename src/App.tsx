import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VotingProvider } from './contexts/VotingContext';
import { AuthProvider } from './contexts/AuthContext';
import VotingInterface from './components/VotingInterface';
import AdminPanel from './components/admin/AdminPanel';
import AdminLogin from './components/admin/AdminLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <AuthProvider>
          <VotingProvider>
            <Routes>
              <Route path="/" element={<VotingInterface />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </VotingProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
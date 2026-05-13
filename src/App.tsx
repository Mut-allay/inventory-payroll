import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Outlets from '@/pages/admin/Outlets';
import Payroll from '@/pages/Payroll';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium text-xl">Loading StockShot...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute allowedRoles={['admin', 'outlet_manager', 'staff']} requireOutlet={true}>
            <Transactions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payroll"
        element={
          <ProtectedRoute allowedRoles={['admin', 'outlet_manager', 'staff']} requireOutlet={true}>
            <Payroll />
          </ProtectedRoute>
        }
      />

      {/* Admin Only */}
      <Route
        path="/admin/outlets"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Outlets />
          </ProtectedRoute>
        }
      />

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </Router>
  );
}

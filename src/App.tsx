import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { seedDatabase } from '@/lib/firebase/seed'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import { Toaster } from '@/components/ui/sonner'

// Basic Unauthorized Placeholder
const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
    <p>You do not have permission to access this page.</p>
    <Button onClick={() => window.location.href = '/'}>Go Home</Button>
  </div>
);

function App() {
  const handleSeed = async () => {
    try {
      await seedDatabase();
      alert('Database seeded successfully!');
    } catch {
      alert('Failed to seed database. Check console.');
    }
  }

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Example of a restricted route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Admin Only Area</h1>
                <Button onClick={handleSeed} className="mt-4">Seed Test Data</Button>
              </div>
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

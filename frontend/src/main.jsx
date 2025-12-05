import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import List from './pages/List.jsx';
import Edit from './pages/Edit.jsx';
import Kanban from './pages/Kanban.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { ToastProvider } from './components/Toast.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import './styles.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<App />}>
              <Route index element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="tickets" element={
                <ProtectedRoute>
                  <List />
                </ProtectedRoute>
              } />
              <Route path="edit/:id" element={
                <ProtectedRoute>
                  <Edit />
                </ProtectedRoute>
              } />
              <Route path="kanban" element={
                <ProtectedRoute>
                  <Kanban />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  </ErrorBoundary>
);

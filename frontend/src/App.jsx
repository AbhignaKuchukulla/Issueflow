import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { initSocket, closeSocket } from './socket.js';

export default function App(){
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.id) {
      initSocket(user.id);
    }

    return () => {
      if (location.pathname === '/login' || location.pathname === '/signup') {
        closeSocket();
      }
    };
  }, [user, location]);

  const handleLogout = () => {
    logout();
    closeSocket();
    navigate('/login');
  };

  // Show auth pages without header
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return <Outlet />;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden="true"></div>
          <h1 className="h1">IssueFlow</h1>
        </div>
        <nav className="nav" style={{display:'flex', gap:12, alignItems:'center'}}>
          {user ? (
            <>
              <Link to="/">Dashboard</Link>
              <Link to="/tickets">Tickets</Link>
              <Link to="/kanban">Kanban</Link>
              <span style={{ fontSize: '14px', color: '#666' }}>👤 {user.name}</span>
              <ThemeToggle />
              <button 
                onClick={handleLogout}
                style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <ThemeToggle />
            </>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

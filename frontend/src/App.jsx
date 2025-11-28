import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle.jsx';
export default function App(){
  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden="true"></div>
          <h1 className="h1">IssueFlow</h1>
        </div>
         <nav className="nav" style={{display:'flex', gap:12, alignItems:'center'}}>
          <Link to="/">Dashboard</Link>
          <Link to="/tickets">Tickets</Link>
          <Link to="/kanban">Kanban</Link>
          <ThemeToggle />
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

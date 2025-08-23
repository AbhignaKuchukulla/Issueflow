import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import List from './pages/List.jsx';
import Edit from './pages/Edit.jsx';
import Kanban from './pages/Kanban.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<List />} />
        <Route path="edit/:id" element={<Edit />} />
+       <Route path="kanban" element={<Kanban />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

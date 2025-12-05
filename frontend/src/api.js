const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// Auth endpoints
export async function signup(name, email, password) {
  const r = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ name, email, password })
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function login(email, password) {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ email, password })
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getCurrentUser() {
  const r = await fetch(`${BASE}/api/auth/me`, {
    headers: getHeaders(true)
  });
  if (!r.ok) throw new Error('Not authenticated');
  return r.json();
}

export async function verifyToken() {
  const r = await fetch(`${BASE}/api/auth/verify`, {
    headers: getHeaders(true)
  });
  return r.ok;
}

export async function listUsers() {
  const r = await fetch(`${BASE}/api/users`, {
    headers: getHeaders(true)
  });
  if (!r.ok) throw new Error('Failed to load users');
  return r.json();
}

export async function listTickets(params = {}) {
  const { q='', status='', priority='', assignee='', sortBy='updatedAt', sortOrder='desc', page=1, pageSize=10, fromDate='', toDate='', overdue=false, tags='' } = params;
  const u = new URL(BASE + '/api/tickets');
  if (q) u.searchParams.set('q', q);
  if (status) u.searchParams.set('status', status);
  if (priority) u.searchParams.set('priority', priority);
  if (assignee) u.searchParams.set('assignee', assignee);
  if (sortBy) u.searchParams.set('sortBy', sortBy);
  if (sortOrder) u.searchParams.set('sortOrder', sortOrder);
  if (fromDate) u.searchParams.set('fromDate', fromDate);
  if (toDate) u.searchParams.set('toDate', toDate);
  if (overdue) u.searchParams.set('overdue', 'true');
  if (tags) u.searchParams.set('tags', tags);
  u.searchParams.set('page', page);
  u.searchParams.set('pageSize', pageSize);
  const r = await fetch(u, { headers: getHeaders(true) });
  if (!r.ok) throw new Error('Failed to load tickets');
  return r.json();
}

export async function getTicket(id) {
  const r = await fetch(`${BASE}/api/tickets/${id}`, { headers: getHeaders(true) });
  if (!r.ok) throw new Error('Not found');
  return r.json();
}

export async function createTicket(payload) {
  const r = await fetch(`${BASE}/api/tickets`, { 
    method:'POST', 
    headers: getHeaders(true), 
    body: JSON.stringify(payload) 
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function updateTicket(id, payload) {
  const r = await fetch(`${BASE}/api/tickets/${id}`, { 
    method:'PUT', 
    headers: getHeaders(true), 
    body: JSON.stringify(payload) 
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deleteTicket(id) {
  const r = await fetch(`${BASE}/api/tickets/${id}`, { 
    method:'DELETE',
    headers: getHeaders(true)
  });
  if (!r.ok && r.status !== 204) throw new Error(await r.text());
}

export async function patchTicket(id, payload) {
  const r = await fetch(`${BASE}/api/tickets/${id}`, {
    method:'PATCH',
    headers: getHeaders(true),
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// Comments API
export async function getComments(ticketId) {
  const r = await fetch(`${BASE}/api/tickets/${ticketId}/comments`, { headers: getHeaders(true) });
  if (!r.ok) throw new Error('Failed to load comments');
  return r.json();
}

export async function createComment(ticketId, payload) {
  const r = await fetch(`${BASE}/api/tickets/${ticketId}/comments`, {
    method:'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deleteComment(id) {
  const r = await fetch(`${BASE}/api/comments/${id}`, { 
    method:'DELETE',
    headers: getHeaders(true)
  });
  if (!r.ok && r.status !== 204) throw new Error(await r.text());
}

// Ticket History API
export async function getTicketHistory(ticketId) {
  const r = await fetch(`${BASE}/api/tickets/${ticketId}/history`);
  if (!r.ok) throw new Error('Failed to load history');
  return r.json();
}

// Bulk Operations API
export async function bulkUpdateTickets(operation, ids, updates, user) {
  const r = await fetch(`${BASE}/api/tickets/bulk`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ operation, ids, updates, user })
  });
  if (!r.ok) throw new Error('Bulk operation failed');
  return r.json();
}

// Analytics API
export async function getAnalytics() {
  const r = await fetch(`${BASE}/api/analytics`);
  if (!r.ok) throw new Error('Failed to load analytics');
  return r.json();
}

// Ticket Linking API
export async function linkTickets(ticketId, relatedId, relationship, user) {
  const r = await fetch(`${BASE}/api/tickets/${ticketId}/link`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ relatedId, relationship, user })
  });
  if (!r.ok) throw new Error('Failed to link tickets');
  return r.json();
}

export async function unlinkTickets(ticketId, relatedId, user) {
  const r = await fetch(`${BASE}/api/tickets/${ticketId}/link/${relatedId}?user=${user || 'System'}`, {
    method: 'DELETE'
  });
  if (!r.ok) throw new Error('Failed to unlink tickets');
  return r.json();
}

// Saved Filters API
export async function getSavedFilters() {
  const r = await fetch(`${BASE}/api/filters`);
  if (!r.ok) throw new Error('Failed to load filters');
  return r.json();
}

export async function createSavedFilter(name, filters) {
  const r = await fetch(`${BASE}/api/filters`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, filters })
  });
  if (!r.ok) throw new Error('Failed to save filter');
  return r.json();
}

export async function deleteSavedFilter(id) {
  const r = await fetch(`${BASE}/api/filters/${id}`, { method: 'DELETE' });
  if (!r.ok && r.status !== 204) throw new Error('Failed to delete filter');
}

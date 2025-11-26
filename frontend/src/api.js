const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
  const r = await fetch(u);
  if (!r.ok) throw new Error('Failed to load tickets');
  return r.json();
}

export async function getTicket(id) {
  const r = await fetch(`${BASE}/api/tickets/${id}`);
  if (!r.ok) throw new Error('Not found');
  return r.json();
}

export async function createTicket(payload) {
  const r = await fetch(`${BASE}/api/tickets`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function updateTicket(id, payload) {
  const r = await fetch(`${BASE}/api/tickets/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deleteTicket(id) {
  const r = await fetch(`${BASE}/api/tickets/${id}`, { method:'DELETE' });
  if (!r.ok && r.status !== 204) throw new Error(await r.text());
}
export async function patchTicket(id, payload) {
  const r = await fetch(`${BASE}/api/tickets/${id}`, {
    method:'PATCH',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// Comments API
export async function getComments(ticketId) {
  const r = await fetch(`${BASE}/api/tickets/${ticketId}/comments`);
  if (!r.ok) throw new Error('Failed to load comments');
  return r.json();
}

export async function createComment(ticketId, payload) {
  const r = await fetch(`${BASE}/api/tickets/${ticketId}/comments`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deleteComment(id) {
  const r = await fetch(`${BASE}/api/comments/${id}`, { method:'DELETE' });
  if (!r.ok && r.status !== 204) throw new Error(await r.text());
}


import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';
import { nanoid } from 'nanoid';

const PORT = process.env.PORT || 8080;
const allowList = (process.env.ALLOWED_ORIGINS || '*')
  .split(',').map(s => s.trim()).filter(Boolean);

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowList.includes('*') || allowList.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS: ' + origin));
  }
}));

const db = await JSONFilePreset('./db.json', { tickets: [] });

if (process.argv.includes('--seed') && db.data.tickets.length === 0) {
  const now = new Date().toISOString();
  db.data.tickets.push(
    { id: nanoid(), title: 'First bug', description: 'Button not clickable', status: 'open', priority: 'high', assignee: 'Alex', createdAt: now, updatedAt: now },
    { id: nanoid(), title: 'Add dark mode', description: 'Feature request', status: 'in_progress', priority: 'medium', assignee: 'Sam', createdAt: now, updatedAt: now },
    { id: nanoid(), title: 'Fix typo on homepage', description: 'UI copy issue', status: 'closed', priority: 'low', assignee: 'Riya', createdAt: now, updatedAt: now }
  );
  await db.write();
  console.log('Seeded 3 example tickets');
  process.exit(0);
}

function validate(payload, { partial=false } = {}) {
  const allowedStatus = ['open','in_progress','review','closed'];
  const allowedPriority = ['low','medium','high','urgent'];
  const e = [];
  const has = (k) => Object.prototype.hasOwnProperty.call(payload, k);

  if (!partial || has('title')) {
    if (typeof payload.title !== 'string' || payload.title.trim().length < 3) e.push('title must be at least 3 chars');
  }
  if (!partial || has('description')) {
    if (typeof payload.description !== 'string' || payload.description.trim().length < 3) e.push('description must be at least 3 chars');
  }
  if (!partial || has('status')) {
    if (!allowedStatus.includes(payload.status)) e.push('status must be one of ' + allowedStatus.join(', '));
  }
  if (!partial || has('priority')) {
    if (!allowedPriority.includes(payload.priority)) e.push('priority must be one of ' + allowedPriority.join(', '));
  }
  if (partial && e.length && Object.keys(payload).length === 0) e.push('nothing to update');
  return e;
}

app.get('/health', (_req,res)=>res.json({ ok:true }));

app.get('/api/tickets', (req,res) => {
  const q = String(req.query.q ?? '').trim().toLowerCase();
  const status = String(req.query.status ?? '');
  const priority = String(req.query.priority ?? '');
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'),10));
  const pageSize = Math.max(1, Math.min(50, parseInt(String(req.query.pageSize ?? '10'),10)));
  const offset = (page-1)*pageSize;

  let items = db.data.tickets;
  if (q) items = items.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  if (['open','in_progress','closed'].includes(status)) items = items.filter(t => t.status === status);
  if (['low','medium','high','urgent'].includes(priority)) items = items.filter(t => t.priority === priority);

  items = items.sort((a,b)=> new Date(b.updatedAt) - new Date(a.updatedAt));
  const total = items.length;
  const data = items.slice(offset, offset+pageSize);
  res.json({ total, page, pageSize, data });
});

app.get('/api/tickets/:id', (req,res) => {
  const t = db.data.tickets.find(x => x.id === req.params.id);
  if (!t) return res.status(404).json({ error:'not_found' });
  res.json(t);
});

app.post('/api/tickets', async (req,res) => {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const now = new Date().toISOString();
  const item = {
    id: nanoid(),
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    status: req.body.status,
    priority: req.body.priority,
    assignee: req.body.assignee ?? '',
    createdAt: now, updatedAt: now
  };
  db.data.tickets.unshift(item);
  await db.write();
  res.status(201).json(item);
});

app.put('/api/tickets/:id', async (req,res) => {
  const idx = db.data.tickets.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error:'not_found' });
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const now = new Date().toISOString();
  const updated = {
    ...db.data.tickets[idx],
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    status: req.body.status,
    priority: req.body.priority,
    assignee: req.body.assignee ?? '',
    updatedAt: now
  };
  db.data.tickets[idx] = updated;
  await db.write();
  res.json(updated);
});

app.patch('/api/tickets/:id', async (req,res) => {
  const idx = db.data.tickets.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error:'not_found' });
  const errors = validate(req.body, { partial:true });
  if (errors.length) return res.status(400).json({ errors });

  const now = new Date().toISOString();
  const updated = { ...db.data.tickets[idx], ...req.body, updatedAt: now };
  if (updated.title) updated.title = String(updated.title).trim();
  if (updated.description) updated.description = String(updated.description).trim();
  db.data.tickets[idx] = updated;
  await db.write();
  res.json(updated);
});

app.delete('/api/tickets/:id', async (req,res) => {
  const before = db.data.tickets.length;
  db.data.tickets = db.data.tickets.filter(x => x.id !== req.params.id);
  if (db.data.tickets.length === before) return res.status(404).json({ error:'not_found' });
  await db.write();
  res.status(204).send();
});

app.listen(PORT, () => console.log(`IssueBuddy API listening on http://localhost:${PORT}`));

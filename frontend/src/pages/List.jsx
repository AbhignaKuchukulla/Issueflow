import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTickets, createTicket, deleteTicket } from '../api.js';
import TicketForm from '../components/TicketForm.jsx';
import Spinner from '../components/Spinner.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useToast } from '../components/Toast.jsx';
import { exportToCSV, exportToJSON } from '../utils/export.js';

function statusBadgeCls(s){ return 'badge ' + (s || 'open'); }
function priorityBadgeCls(p){ return 'badge ' + (p || 'medium'); }

export default function List(){
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ total:0, page:1, pageSize:10, data:[] });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const debouncedQ = useDebounce(q, 300);

  async function load(){ 
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: debouncedQ,
        status,
        priority,
        assignee: assigneeFilter,
        sortBy,
        sortOrder,
        page: page.toString(),
        pageSize: '10'
      });
      if (fromDate) params.set('fromDate', fromDate);
      if (toDate) params.set('toDate', toDate);
      if (overdueOnly) params.set('overdue', 'true');
      
      const response = await listTickets(Object.fromEntries(params));
      setData(response);
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); }, [page, debouncedQ, status, priority, assigneeFilter, sortBy, sortOrder, fromDate, toDate, overdueOnly]);

  async function onCreate(payload){
    setSubmitting(true);
    try { 
      await createTicket(payload); 
      setQ(''); 
      setStatus(''); 
      setPriority(''); 
      setAssigneeFilter('');
      setFromDate('');
      setToDate('');
      setOverdueOnly(false);
      setPage(1); 
      await load(); 
      toast.success('Ticket created successfully!');
    }
    catch (e){ 
      toast.error('Failed to create ticket');
    }
    finally { setSubmitting(false); }
  }

  async function onDelete(id){
    if (!confirm('Delete this ticket?')) return;
    try {
      await deleteTicket(id);
      await load();
      toast.success('Ticket deleted successfully!');
    } catch (e) {
      toast.error('Failed to delete ticket');
    }
  }

  const toggleSelect = (id) => {
    const newSet = new Set(selectedTickets);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedTickets(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedTickets.size === data.data.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(data.data.map(t => t.id)));
    }
  };

  async function bulkDelete() {
    if (selectedTickets.size === 0) return;
    if (!confirm(`Delete ${selectedTickets.size} selected tickets?`)) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/tickets/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'delete',
          ids: Array.from(selectedTickets),
          user: 'User'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success(`Deleted ${result.success.length} tickets!`);
        setSelectedTickets(new Set());
        await load();
      }
    } catch (e) {
      toast.error('Bulk delete failed');
    }
  }

  async function bulkUpdate(updates) {
    if (selectedTickets.size === 0) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/tickets/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'update',
          ids: Array.from(selectedTickets),
          updates,
          user: 'User'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success(`Updated ${result.success.length} tickets!`);
        setSelectedTickets(new Set());
        await load();
      }
    } catch (e) {
      toast.error('Bulk update failed');
    }
  }

  return (
    <div className="grid" style={{display:'grid', gridTemplateColumns:'1.2fr .8fr', gap:24}}>
      {/* LEFT: list */}
      <div>
        <div className="card">
          <div className="card-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span>Tickets</span>
            <div style={{display:'flex', gap:8}}>
              <button 
                className="btn btn-outline" 
                style={{padding:'6px 10px', fontSize:'12px'}}
                onClick={() => {
                  exportToCSV(data.data, `tickets-${new Date().toISOString().split('T')[0]}.csv`);
                  toast.success('Exported to CSV!');
                }}
                title="Export current page to CSV"
              >
                📥 CSV
              </button>
              <button 
                className="btn btn-outline"
                style={{padding:'6px 10px', fontSize:'12px'}}
                onClick={() => {
                  exportToJSON(data.data, `tickets-${new Date().toISOString().split('T')[0]}.json`);
                  toast.success('Exported to JSON!');
                }}
                title="Export current page to JSON"
              >
                📥 JSON
              </button>
            </div>
          </div>
          <div className="card-body">
            {/* Filters */}
            <div className="toolbar">
              <input className="input" placeholder="Search title or description…" value={q} onChange={e=>setQ(e.target.value)} />
              <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
                <option value="">status: any</option>
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="review">review</option>
                <option value="closed">closed</option>
              </select>
              <select className="select" value={priority} onChange={e=>setPriority(e.target.value)}>
                <option value="">priority: any</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="urgent">urgent</option>
              </select>
              <button 
                className="btn btn-outline" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{whiteSpace: 'nowrap'}}
              >
                {showAdvanced ? '▼' : '▶'} Advanced
              </button>
              {loading && <div style={{display:'flex', alignItems:'center', gap:8}}><Spinner size="small" /><span className="small">Searching...</span></div>}
            </div>

            {showAdvanced && (
              <div className="toolbar" style={{borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 0}}>
                <input 
                  className="input" 
                  placeholder="Filter by assignee..." 
                  value={assigneeFilter} 
                  onChange={e=>setAssigneeFilter(e.target.value)} 
                />
                <input 
                  type="date" 
                  className="input" 
                  placeholder="From date" 
                  value={fromDate} 
                  onChange={e=>setFromDate(e.target.value)} 
                />
                <input 
                  type="date" 
                  className="input" 
                  placeholder="To date" 
                  value={toDate} 
                  onChange={e=>setToDate(e.target.value)} 
                />
                <select className="select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                  <option value="updatedAt">Sort: Updated</option>
                  <option value="createdAt">Sort: Created</option>
                  <option value="priority">Sort: Priority</option>
                  <option value="dueDate">Sort: Due Date</option>
                </select>
                <select className="select" value={sortOrder} onChange={e=>setSortOrder(e.target.value)}>
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
                <label style={{display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap', cursor:'pointer'}}>
                  <input 
                    type="checkbox" 
                    checked={overdueOnly} 
                    onChange={e=>setOverdueOnly(e.target.checked)} 
                  />
                  <span className="small">Overdue only</span>
                </label>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedTickets.size > 0 && (
              <div className="toolbar" style={{background: 'rgba(99,102,241,.1)', padding: 10, borderRadius: 8}}>
                <span className="small">{selectedTickets.size} selected</span>
                <button className="btn btn-outline" onClick={() => bulkUpdate({status: 'in_progress'})}>
                  Mark In Progress
                </button>
                <button className="btn btn-outline" onClick={() => bulkUpdate({status: 'closed'})}>
                  Close All
                </button>
                <button className="btn btn-danger" onClick={bulkDelete}>
                  Delete Selected
                </button>
                <button className="btn btn-outline" onClick={() => setSelectedTickets(new Set())}>
                  Clear Selection
                </button>
              </div>
            )}

            {/* Table */}
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      checked={data.data.length > 0 && selectedTickets.size === data.data.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map(t => {
                  const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'closed';
                  return (
                    <tr key={t.id} style={isOverdue ? {background: 'rgba(239,68,68,.1)'} : {}}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedTickets.has(t.id)}
                          onChange={() => toggleSelect(t.id)}
                        />
                      </td>
                      <td><code className="ticket-id">{t.id.substring(0, 8)}</code></td>
                      <td>
                        <Link to={`/edit/${t.id}`}>{t.title}</Link>
                        {t.tags && t.tags.length > 0 && (
                          <div style={{marginTop: 4}}>
                            {t.tags.map(tag => (
                              <span key={tag} className="badge" style={{fontSize: 10, marginRight: 4}}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td><span className={statusBadgeCls(t.status)}>{t.status}</span></td>
                      <td><span className={priorityBadgeCls(t.priority)}>{t.priority}</span></td>
                      <td>{t.assignee || '-'}</td>
                      <td className="small">
                        {t.dueDate ? (
                          <>
                            {new Date(t.dueDate).toLocaleDateString()}
                            {isOverdue && <span style={{color: 'var(--danger)', marginLeft: 4}}>⚠️</span>}
                          </>
                        ) : '-'}
                      </td>
                      <td className="small">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="small">{new Date(t.updatedAt).toLocaleString()}</td>
                      <td style={{display:'flex', gap:8}}>
                        <Link className="btn btn-outline" to={`/edit/${t.id}`}>Edit</Link>
                        <button className="btn btn-danger" onClick={()=>onDelete(t.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
                {!data.data.length && <tr><td colSpan="10">No tickets</td></tr>}
              </tbody>
            </table>

            {/* Pager */}
            <div className="pager">
              <button className="btn btn-outline" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
              <span>Page {page}</span>
              <button className="btn btn-outline" disabled={(data.page*data.pageSize)>=data.total} onClick={()=>setPage(p=>p+1)}>Next</button>
              <span className="counter">{data.total} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: form */}
      <div>
        <div className="card">
          <div className="card-header">Create new ticket</div>
          <div className="card-body">
            <TicketForm onSubmit={onCreate} submitting={submitting} />
          </div>
        </div>
      </div>
    </div>
  );
}

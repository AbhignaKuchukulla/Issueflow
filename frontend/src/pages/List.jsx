import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTickets, createTicket, deleteTicket } from '../api.js';
import TicketForm from '../components/TicketForm.jsx';

function statusBadgeCls(s){ return 'badge ' + (s || 'open'); }
function priorityBadgeCls(p){ return 'badge ' + (p || 'medium'); }

export default function List(){
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ total:0, page:1, pageSize:10, data:[] });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  async function load(){ setData(await listTickets({ q, status, priority, page })); }
  useEffect(()=>{ load(); }, [page]);

  async function onCreate(payload){
    setSubmitting(true);
    try { await createTicket(payload); setQ(''); setStatus(''); setPriority(''); setPage(1); await load(); setMsg('Created!'); }
    catch (e){ setMsg('Create failed'); }
    finally { setSubmitting(false); }
  }

  async function onDelete(id){
    if (!confirm('Delete this ticket?')) return;
    await deleteTicket(id);
    await load();
  }

  return (
    <div className="grid" style={{display:'grid', gridTemplateColumns:'1.2fr .8fr', gap:24}}>
      {/* LEFT: list */}
      <div>
        <div className="card">
          <div className="card-header">Tickets</div>
          <div className="card-body">
            {/* Filters */}
            <div className="toolbar">
              <input className="input" placeholder="Search title or description…" value={q} onChange={e=>setQ(e.target.value)} />
              <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
                <option value="">status: any</option>
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="closed">closed</option>
              </select>
              <select className="select" value={priority} onChange={e=>setPriority(e.target.value)}>
                <option value="">priority: any</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="urgent">urgent</option>
              </select>
              <button className="btn btn-outline" onClick={()=>{ setPage(1); load(); }}>Search</button>
            </div>

            {/* Table */}
            <table className="table">
              <thead>
                <tr><th>Title</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Updated</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {data.data.map(t => (
                  <tr key={t.id}>
                    <td><Link to={`/edit/${t.id}`}>{t.title}</Link></td>
                    <td><span className={statusBadgeCls(t.status)}>{t.status}</span></td>
                    <td><span className={priorityBadgeCls(t.priority)}>{t.priority}</span></td>
                    <td>{t.assignee || '-'}</td>
                    <td>{new Date(t.updatedAt).toLocaleString()}</td>
                    <td style={{display:'flex', gap:8}}>
                      <Link className="btn btn-outline" to={`/edit/${t.id}`}>Edit</Link>
                      <button className="btn btn-danger" onClick={()=>onDelete(t.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!data.data.length && <tr><td colSpan="6">No tickets</td></tr>}
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
            <div className="small" style={{marginTop:8}}>{msg}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm.jsx';
import { getTicket, updateTicket } from '../api.js';

export default function Edit(){
  const { id } = useParams();
  const nav = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { (async () => {
    try { setTicket(await getTicket(id)); } catch { nav('/'); }
  })(); }, [id]);

  async function onSubmit(payload){
    setSaving(true);
    try { const t = await updateTicket(id, payload); setTicket(t); setMsg('Saved!'); }
    catch (e) { setMsg('Save failed'); }
    finally { setSaving(false); }
  }

  if (!ticket) return <div className="small">Loading…</div>;
  return (
    <div className="card">
      <div className="card-header">Edit Ticket</div>
      <div className="card-body">
        <TicketForm initial={ticket} onSubmit={onSubmit} submitting={saving} />
        <div className="small" style={{marginTop:8}}>{msg}</div>
      </div>
    </div>
  );
}

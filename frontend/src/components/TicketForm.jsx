import React, { useState, useEffect } from 'react';

export default function TicketForm({ initial, onSubmit, submitting }){
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [status, setStatus] = useState(initial?.status || 'open');
  const [priority, setPriority] = useState(initial?.priority || 'medium');
  const [assignee, setAssignee] = useState(initial?.assignee || '');

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setStatus(initial?.status || 'open');
    setPriority(initial?.priority || 'medium');
    setAssignee(initial?.assignee || '');
  }, [initial]);

  return (
    <form
      onSubmit={(e)=>{ e.preventDefault(); onSubmit({ title, description, status, priority, assignee }); }}
      className="form"
    >
      <input className="input" required minLength={3} placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="input" rows={5} required minLength={3} placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <div className="inline">
        <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="open">open</option>
          <option value="in_progress">in_progress</option>
          <option value="review">review</option>
          <option value="closed">closed</option>
        </select>
        <select className="select" value={priority} onChange={e=>setPriority(e.target.value)}>
          <option value="low">low</option>
          <option value="medium" >medium</option>
          <option value="high">high</option>
          <option value="urgent">urgent</option>
        </select>
        <input className="input" placeholder="Assignee" value={assignee} onChange={e=>setAssignee(e.target.value)} />
      </div>
      <button className="btn" disabled={submitting}>{submitting ? 'Saving…' : 'Save Ticket'}</button>
      <div className="small">Tip: keep titles short and actionable.</div>
    </form>
  );
}

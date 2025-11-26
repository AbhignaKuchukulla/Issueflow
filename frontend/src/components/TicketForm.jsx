import React, { useState, useEffect } from 'react';
import { TICKET_TEMPLATES } from '../utils/templates.js';

export default function TicketForm({ initial, onSubmit, submitting }){
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [status, setStatus] = useState(initial?.status || 'open');
  const [priority, setPriority] = useState(initial?.priority || 'medium');
  const [assignee, setAssignee] = useState(initial?.assignee || '');
  const [dueDate, setDueDate] = useState(initial?.dueDate || '');
  const [tags, setTags] = useState((initial?.tags || []).join(', '));

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setStatus(initial?.status || 'open');
    setPriority(initial?.priority || 'medium');
    setAssignee(initial?.assignee || '');
    setDueDate(initial?.dueDate || '');
    setTags((initial?.tags || []).join(', '));
  }, [initial]);

  const applyTemplate = (templateId) => {
    const template = TICKET_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setDescription(template.description);
      setPriority(template.priority);
      setTags(template.tags.join(', '));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    onSubmit({ 
      title, 
      description, 
      status, 
      priority, 
      assignee, 
      dueDate: dueDate || null,
      tags: tagsArray
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {!initial && (
        <div style={{ marginBottom: 12 }}>
          <label className="small" style={{ display: 'block', marginBottom: 6 }}>
            Start with a template (optional):
          </label>
          <select 
            className="select" 
            onChange={(e) => e.target.value && applyTemplate(e.target.value)}
            defaultValue=""
          >
            <option value="">-- Select Template --</option>
            {TICKET_TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}
      
      <input 
        className="input" 
        required 
        minLength={3} 
        maxLength={100}
        placeholder="Title (3-100 characters)" 
        value={title} 
        onChange={e=>setTitle(e.target.value)} 
      />
      <textarea 
        className="input" 
        rows={8} 
        required 
        minLength={3} 
        maxLength={1000}
        placeholder="Description (3-1000 characters)" 
        value={description} 
        onChange={e=>setDescription(e.target.value)} 
      />
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
      </div>
      <div className="inline">
        <input 
          className="input" 
          maxLength={50}
          placeholder="Assignee (optional, max 50 chars)" 
          value={assignee} 
          onChange={e=>setAssignee(e.target.value)} 
        />
        <input 
          type="date"
          className="input" 
          placeholder="Due date (optional)" 
          value={dueDate} 
          onChange={e=>setDueDate(e.target.value)} 
        />
      </div>
      <input 
        className="input" 
        placeholder="Tags (comma separated, e.g: bug, urgent, frontend)" 
        value={tags} 
        onChange={e=>setTags(e.target.value)} 
      />
      <button className="btn" disabled={submitting}>{submitting ? 'Saving…' : 'Save Ticket'}</button>
      <div className="small">Tip: Use templates for consistent ticket structure.</div>
    </form>
  );
}

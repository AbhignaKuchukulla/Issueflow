import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm.jsx';
import Comments from '../components/Comments.jsx';
import History from '../components/History.jsx';
import RelatedTickets from '../components/RelatedTickets.jsx';
import Spinner from '../components/Spinner.jsx';
import { getTicket, updateTicket } from '../api.js';
import { useToast } from '../components/Toast.jsx';

export default function Edit(){
  const { id } = useParams();
  const nav = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { (async () => {
    try { setTicket(await getTicket(id)); } 
    catch { 
      toast.error('Ticket not found');
      nav('/'); 
    }
  })(); }, [id, refreshKey]);

  async function onSubmit(payload){
    setSaving(true);
    try { 
      const t = await updateTicket(id, payload); 
      setTicket(t); 
      toast.success('Ticket updated successfully!');
    }
    catch (e) { 
      toast.error('Failed to update ticket');
    }
    finally { setSaving(false); }
  }

  if (!ticket) return <div style={{display:'flex', alignItems:'center', gap:10, padding:20}}><Spinner /><span>Loading ticket...</span></div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28, alignItems: 'start' }}>
      <div className="card" style={{ position: 'sticky', top: 20 }}>
        <div className="card-header" style={{ fontSize: '17px', fontWeight: 600 }}>✏️ Edit Ticket</div>
        <div className="card-body">
          <TicketForm initial={ticket} onSubmit={onSubmit} submitting={saving} />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <div className="card-header">Discussion</div>
          <div className="card-body">
            <Comments ticketId={id} />
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <RelatedTickets 
              ticketId={id} 
              relatedTickets={ticket.relatedTickets || []}
              onUpdate={() => setRefreshKey(k => k + 1)}
              showToast={(msg, type) => type === 'success' ? toast.success(msg) : toast.error(msg)}
            />
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <History ticketId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

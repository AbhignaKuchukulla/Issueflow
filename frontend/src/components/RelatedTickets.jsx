import React, { useState, useEffect } from 'react';
import { linkTickets, unlinkTickets, listTickets } from '../api.js';

export default function RelatedTickets({ ticketId, relatedTickets = [], onUpdate, showToast }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [allTickets, setAllTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [relationship, setRelationship] = useState('related');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showAddDialog) {
      loadTickets();
    }
  }, [showAddDialog]);

  async function loadTickets() {
    try {
      const result = await listTickets({ pageSize: 100 });
      // Exclude current ticket and already related tickets
      const relatedIds = relatedTickets.map(r => r.id);
      const available = result.data.filter(t => t.id !== ticketId && !relatedIds.includes(t.id));
      setAllTickets(available);
    } catch (error) {
      showToast?.('Failed to load tickets', 'error');
    }
  }

  async function handleAddLink() {
    if (!selectedTicketId) return;
    
    setLoading(true);
    try {
      await linkTickets(ticketId, selectedTicketId, relationship, 'User');
      showToast?.('Ticket linked successfully', 'success');
      setShowAddDialog(false);
      setSelectedTicketId('');
      setRelationship('related');
      onUpdate?.();
    } catch (error) {
      showToast?.('Failed to link ticket', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveLink(relatedId) {
    if (!confirm('Remove this ticket link?')) return;
    
    try {
      await unlinkTickets(ticketId, relatedId, 'User');
      showToast?.('Ticket unlinked successfully', 'success');
      onUpdate?.();
    } catch (error) {
      showToast?.('Failed to unlink ticket', 'error');
    }
  }

  const filteredTickets = allTickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.includes(searchQuery)
  );

  const getRelationshipIcon = (type) => {
    switch(type) {
      case 'blocks': return '🚫';
      case 'blocked_by': return '⛔';
      case 'duplicates': return '📋';
      case 'related': return '🔗';
      default: return '🔗';
    }
  };

  const getRelationshipLabel = (type) => {
    return type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Related Tickets</h3>
        <button 
          className="btn btn-sm"
          onClick={() => setShowAddDialog(true)}
          style={{ padding: '4px 12px', fontSize: 13 }}
        >
          + Link Ticket
        </button>
      </div>

      {relatedTickets.length === 0 ? (
        <div className="small" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          No related tickets
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {relatedTickets.map(related => (
            <div 
              key={related.id}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: 10,
                background: 'rgba(255,255,255,.03)',
                border: '1px solid var(--border)',
                borderRadius: 6
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{getRelationshipIcon(related.type)}</span>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {getRelationshipLabel(related.type)}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    #{related.id.substring(0, 8)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveLink(related.id)}
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  padding: 4,
                  fontSize: 18
                }}
                title="Remove link"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Link Dialog */}
      {showAddDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg)',
            padding: 24,
            borderRadius: 12,
            width: '90%',
            maxWidth: 500,
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: 16, fontSize: 18 }}>Link Ticket</h3>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Relationship Type</label>
              <select 
                className="form-input"
                value={relationship}
                onChange={e => setRelationship(e.target.value)}
              >
                <option value="related">Related to</option>
                <option value="blocks">Blocks</option>
                <option value="blocked_by">Blocked by</option>
                <option value="duplicates">Duplicates</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Search Tickets</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by title or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16, maxHeight: 300, overflow: 'auto' }}>
              {filteredTickets.length === 0 ? (
                <div className="small" style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
                  No tickets found
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredTickets.map(ticket => (
                    <label
                      key={ticket.id}
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: 10,
                        padding: 10,
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: selectedTicketId === ticket.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                      }}
                    >
                      <input
                        type="radio"
                        name="selectedTicket"
                        value={ticket.id}
                        checked={selectedTicketId === ticket.id}
                        onChange={e => setSelectedTicketId(e.target.value)}
                        style={{ marginTop: 4 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{ticket.title}</div>
                        <div className="small" style={{ color: 'var(--text-muted)' }}>
                          #{ticket.id.substring(0, 8)} • {ticket.status} • {ticket.priority}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                className="btn"
                onClick={() => {
                  setShowAddDialog(false);
                  setSelectedTicketId('');
                  setSearchQuery('');
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddLink}
                disabled={!selectedTicketId || loading}
              >
                {loading ? 'Linking...' : 'Link Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

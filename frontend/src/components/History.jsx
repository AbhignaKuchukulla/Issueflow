import React, { useState, useEffect } from 'react';
import Spinner from './Spinner.jsx';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function History({ ticketId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/tickets/${ticketId}/history`);
        if (res.ok) {
          setHistory(await res.json());
        }
      } catch (e) {
        console.error('Failed to load history', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ticketId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Spinner size="small" /> <span className="small">Loading history...</span>
      </div>
    );
  }

  if (history.length === 0) {
    return <div className="small" style={{ opacity: 0.6 }}>No history available</div>;
  }

  const formatChange = (key, change) => {
    if (!change) return '';
    if (key === 'ticket') return 'Ticket created';
    return `${key}: ${change.from || '(empty)'} → ${change.to || '(empty)'}`;
  };

  return (
    <div className="history-section">
      <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {history.map(entry => (
          <div key={entry.id} className="history-entry">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <strong>{entry.user}</strong>
                <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--muted)' }}>
                  {entry.action === 'created' && '✨ Created'}
                  {entry.action === 'updated' && '📝 Updated'}
                  {entry.action === 'bulk_updated' && '📦 Bulk Updated'}
                  {entry.action === 'deleted' && '🗑️ Deleted'}
                </span>
              </div>
              <span className="small">{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
            {entry.changes && Object.keys(entry.changes).length > 0 && (
              <div style={{ marginTop: 6, fontSize: 13 }}>
                {Object.entries(entry.changes).map(([key, value]) => (
                  <div key={key} className="small" style={{ marginBottom: 2 }}>
                    • {formatChange(key, value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

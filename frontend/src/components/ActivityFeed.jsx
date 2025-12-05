import React, { useEffect, useState } from 'react';
import { on } from '../socket.js';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    // Listen for real-time events
    const unsubTicketCreated = on('ticket:created', (data) => {
      setActivities(prev => [{
        type: 'ticket_created',
        ticket: data.ticket,
        user: data.user,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 19)]);
    });

    const unsubTicketUpdated = on('ticket:updated', (data) => {
      setActivities(prev => [{
        type: 'ticket_updated',
        ticket: data.ticket,
        changes: data.changes,
        user: data.user,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 19)]);
    });

    const unsubCommentAdded = on('comment:added', (data) => {
      setActivities(prev => [{
        type: 'comment_added',
        comment: data.comment,
        ticket: data.ticket,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 19)]);
    });

    const unsubPresence = on('presence:update', (data) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (data.isOnline) {
          next.add(data.userId);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    return () => {
      unsubTicketCreated();
      unsubTicketUpdated();
      unsubCommentAdded();
      unsubPresence();
    };
  }, []);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div style={{ padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
      <h3 style={{ marginTop: 0 }}>📊 Live Activity Feed</h3>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        {onlineUsers.size} users online
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {activities.length === 0 ? (
          <p style={{ color: '#999' }}>No activity yet. Start creating tickets!</p>
        ) : (
          activities.map((activity, i) => (
            <div key={i} style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '13px' }}>
              {activity.type === 'ticket_created' && (
                <p style={{ margin: 0 }}>
                  <strong>{activity.user || 'Someone'}</strong> created ticket <strong>#{activity.ticket.id}</strong>: <em>{activity.ticket.title}</em>
                  <br />
                  <small style={{ color: '#999' }}>{formatTime(activity.timestamp)}</small>
                </p>
              )}
              {activity.type === 'ticket_updated' && (
                <p style={{ margin: 0 }}>
                  <strong>{activity.user || 'Someone'}</strong> updated <strong>#{activity.ticket.id}</strong>
                  {activity.changes.status && ` (${activity.changes.status.from} → ${activity.changes.status.to})`}
                  <br />
                  <small style={{ color: '#999' }}>{formatTime(activity.timestamp)}</small>
                </p>
              )}
              {activity.type === 'comment_added' && (
                <p style={{ margin: 0 }}>
                  💬 Comment on <strong>#{activity.ticket.id}</strong>: <em>"{activity.comment.text.substring(0, 40)}..."</em>
                  <br />
                  <small style={{ color: '#999' }}>{formatTime(activity.timestamp)}</small>
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

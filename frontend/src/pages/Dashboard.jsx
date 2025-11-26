import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch(`${API_BASE}/api/analytics`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error('Failed to load analytics', e);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 20 }}>
        <Spinner /> <span>Loading dashboard...</span>
      </div>
    );
  }

  if (!data) return <div className="small">Failed to load analytics</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 700 }}>Dashboard</h2>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div className="card-body">
            <div className="kpi-label">Total Tickets</div>
            <div className="kpi-value">{data.total}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="kpi-label">Open</div>
            <div className="kpi-value" style={{ color: 'var(--ok)' }}>{data.byStatus.open}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="kpi-label">In Progress</div>
            <div className="kpi-value" style={{ color: 'var(--warn)' }}>{data.byStatus.in_progress}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="kpi-label">Overdue</div>
            <div className="kpi-value" style={{ color: 'var(--danger)' }}>{data.overdue}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Status Breakdown */}
        <div className="card">
          <div className="card-header">Status Breakdown</div>
          <div className="card-body">
            {Object.entries(data.byStatus).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="card">
          <div className="card-header">Priority Breakdown</div>
          <div className="card-body">
            {Object.entries(data.byPriority).map(([priority, count]) => (
              <div key={priority} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ textTransform: 'capitalize' }}>{priority}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">Team Performance</div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Assignee</th>
                <th>Total</th>
                <th>Open</th>
                <th>Closed</th>
                <th>Completion %</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.assigneeStats)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([assignee, stats]) => (
                  <tr key={assignee}>
                    <td>{assignee}</td>
                    <td>{stats.total}</td>
                    <td>{stats.open}</td>
                    <td>{stats.closed}</td>
                    <td>{stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">Recent Activity</div>
        <div className="card-body">
          {data.recentActivity.length === 0 ? (
            <div className="small">No recent activity</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.recentActivity.map(activity => (
                <div key={activity.id} style={{ padding: 10, background: 'rgba(255,255,255,.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong>{activity.user}</strong>
                    <span className="small">{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="small">
                    {activity.action === 'created' && '✨ Created ticket'}
                    {activity.action === 'updated' && `📝 Updated: ${Object.keys(activity.changes).join(', ')}`}
                    {activity.action === 'bulk_updated' && `📦 Bulk updated: ${Object.keys(activity.changes).join(', ')}`}
                    {activity.action === 'deleted' && '🗑️ Deleted ticket'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

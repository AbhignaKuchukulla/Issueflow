import React, { useState, useEffect } from 'react';
import { getSavedFilters, createSavedFilter, deleteSavedFilter } from '../api.js';

export default function SavedFilters({ currentFilters, onApplyFilter, showToast }) {
  const [savedFilters, setSavedFilters] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilters();
  }, []);

  async function loadFilters() {
    try {
      const filters = await getSavedFilters();
      setSavedFilters(filters);
    } catch (error) {
      console.error('Failed to load saved filters', error);
    }
  }

  async function handleSaveFilter() {
    if (!filterName.trim()) {
      showToast?.('Please enter a filter name', 'error');
      return;
    }

    setLoading(true);
    try {
      await createSavedFilter(filterName.trim(), currentFilters);
      showToast?.('Filter saved successfully', 'success');
      setShowSaveDialog(false);
      setFilterName('');
      loadFilters();
    } catch (error) {
      showToast?.('Failed to save filter', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteFilter(id) {
    if (!confirm('Delete this saved filter?')) return;

    try {
      await deleteSavedFilter(id);
      showToast?.('Filter deleted successfully', 'success');
      loadFilters();
    } catch (error) {
      showToast?.('Failed to delete filter', 'error');
    }
  }

  function handleApplyFilter(filters) {
    onApplyFilter?.(filters);
    showToast?.('Filter applied', 'success');
  }

  const hasActiveFilters = Object.values(currentFilters).some(v => 
    v !== '' && v !== false && v !== 'updatedAt' && v !== 'desc'
  );

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {savedFilters.length > 0 && (
          <>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginRight: 4 }}>
              Quick Filters:
            </span>
            {savedFilters.map(filter => (
              <div 
                key={filter.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  padding: '4px 10px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 6,
                  fontSize: 13
                }}
              >
                <button
                  onClick={() => handleApplyFilter(filter.filters)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 13,
                    fontWeight: 500
                  }}
                >
                  {filter.name}
                </button>
                <button
                  onClick={() => handleDeleteFilter(filter.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 14,
                    lineHeight: 1
                  }}
                  title="Delete filter"
                >
                  ×
                </button>
              </div>
            ))}
          </>
        )}

        {hasActiveFilters && (
          <button
            className="btn btn-sm"
            onClick={() => setShowSaveDialog(true)}
            style={{ 
              padding: '4px 10px',
              fontSize: 13,
              background: 'var(--primary)',
              color: 'white'
            }}
          >
            💾 Save Current Filter
          </button>
        )}
      </div>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
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
            maxWidth: 400,
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: 16, fontSize: 18 }}>Save Filter</h3>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Filter Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., My Open Tickets"
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveFilter()}
                autoFocus
                maxLength={50}
              />
            </div>

            <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
              <strong>Current filters:</strong>
              <ul style={{ marginTop: 8, marginLeft: 20 }}>
                {currentFilters.q && <li>Search: {currentFilters.q}</li>}
                {currentFilters.status && <li>Status: {currentFilters.status}</li>}
                {currentFilters.priority && <li>Priority: {currentFilters.priority}</li>}
                {currentFilters.assignee && <li>Assignee: {currentFilters.assignee}</li>}
                {currentFilters.tags && <li>Tags: {currentFilters.tags}</li>}
                {currentFilters.fromDate && <li>From: {currentFilters.fromDate}</li>}
                {currentFilters.toDate && <li>To: {currentFilters.toDate}</li>}
                {currentFilters.overdue && <li>Overdue only</li>}
                {currentFilters.sortBy !== 'updatedAt' && <li>Sort by: {currentFilters.sortBy}</li>}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                className="btn"
                onClick={() => {
                  setShowSaveDialog(false);
                  setFilterName('');
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveFilter}
                disabled={!filterName.trim() || loading}
              >
                {loading ? 'Saving...' : 'Save Filter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

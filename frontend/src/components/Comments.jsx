import React, { useState, useEffect } from 'react';
import { getComments, createComment, deleteComment } from '../api.js';
import { useToast } from './Toast.jsx';
import Spinner from './Spinner.jsx';

export default function Comments({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function load() {
    try {
      setLoading(true);
      const data = await getComments(ticketId);
      setComments(data);
    } catch (e) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [ticketId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (text.trim().length === 0) return;
    
    setSubmitting(true);
    try {
      const comment = await createComment(ticketId, { text, author: author || 'Anonymous' });
      setComments(prev => [comment, ...prev]);
      setText('');
      toast.success('Comment added!');
    } catch (e) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
      toast.success('Comment deleted!');
    } catch (e) {
      toast.error('Failed to delete comment');
    }
  }

  return (
    <div className="comments-section">
      <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="comment-form" style={{ marginBottom: 20 }}>
        <textarea
          className="input"
          rows={3}
          maxLength={500}
          placeholder="Add a comment... (max 500 characters)"
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
          <input
            className="input"
            style={{ flex: 1 }}
            maxLength={50}
            placeholder="Your name (optional)"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
          <button className="btn" disabled={submitting || text.trim().length === 0}>
            {submitting ? 'Posting...' : 'Add Comment'}
          </button>
        </div>
      </form>

      {loading ? (
        <div style={{display:'flex', alignItems:'center', gap:10}}><Spinner size="small" /><span className="small">Loading comments...</span></div>
      ) : comments.length === 0 ? (
        <div className="small" style={{ opacity: 0.6 }}>No comments yet. Be the first to comment!</div>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <strong>{comment.author}</strong>
                  <span className="small" style={{ marginLeft: 10 }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  className="btn btn-danger"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              </div>
              <div>{comment.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

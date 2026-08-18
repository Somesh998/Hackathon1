import React, { useEffect, useState } from 'react';
import { MousePointerClick, Heart, Bookmark, Eye, Share2, CornerDownRight, User } from 'lucide-react';
import apiClient from '../services/api';

export const InteractionTester = ({ studentId = 'student_101', reloadTrigger }) => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserInteractions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/interactions/user/${studentId}`);
      if (res.data.success) {
        setInteractions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user interactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInteractions();
  }, [studentId, reloadTrigger]);

  return (
    <div className="glass-panel card-content" style={{ marginTop: '2rem' }}>
      <div className="card-header-flex">
        <div className="card-title-group">
          <div className="card-icon-box purple">
            <MousePointerClick size={20} />
          </div>
          <div>
            <h3>Interaction Telemetry ({studentId})</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Live telemetry stream recorded in MongoDB (POST /api/interactions)
            </p>
          </div>
        </div>

        <span className="badge badge-phase">
          <User size={13} /> {interactions.length} Events Logged
        </span>
      </div>

      {interactions.length === 0 ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          No interactions logged for this student yet. Click Like / Save / Watch on any reel above!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {interactions.slice(0, 5).map((item, idx) => (
            <div
              key={item._id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background:
                      item.interactionType === 'LIKE'
                        ? 'rgba(244, 63, 94, 0.2)'
                        : item.interactionType === 'SAVE'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(6, 182, 212, 0.2)',
                    color:
                      item.interactionType === 'LIKE'
                        ? '#fb7185'
                        : item.interactionType === 'SAVE'
                        ? '#fbbf24'
                        : '#38bdf8',
                  }}
                >
                  {item.interactionType}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.reelId}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <span>Watch: {item.watchDuration || 0}s</span>
                <span>Rate: {Math.round((item.completionRate || 0) * 100)}%</span>
                <span>{item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'now'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

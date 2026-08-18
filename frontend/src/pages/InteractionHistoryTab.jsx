import React, { useState, useEffect } from 'react';
import { History, Heart, Bookmark, Share2, SkipForward, Eye, Clock, CheckCircle2, Filter } from 'lucide-react';
import apiClient from '../services/api';

export const InteractionHistoryTab = ({ userId = 'student_tech_curious_01', reloadTrigger }) => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/interactions/user/${userId}`);
      if (res.data.success) {
        setInteractions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load telemetry history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId, reloadTrigger]);

  const getActionIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return <Heart size={14} color="var(--accent-rose)" />;
      case 'SAVE':
        return <Bookmark size={14} color="var(--accent-amber)" />;
      case 'SHARE':
        return <Share2 size={14} color="var(--accent-indigo)" />;
      case 'SKIP':
        return <SkipForward size={14} color="var(--text-muted)" />;
      default:
        return <Eye size={14} color="var(--accent-cyan)" />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Student Telemetry & Interaction History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time chronological log of video watch events, completion rates, and active curation signals
          </p>
        </div>

        <span className="badge badge-tech">
          {interactions.length} Telemetry Events Logged
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading interaction history...
        </div>
      ) : !interactions.length ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No telemetry events recorded yet. Go to the <strong>Reel Feed</strong> tab to start interacting!
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {interactions.map((item, idx) => {
              const completionPct = Math.round((item.completionRate || 0.8) * 100);
              const isHigh = completionPct >= 80;

              return (
                <div
                  key={item._id || idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getActionIcon(item.interactionType)}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>
                        Reel ID: {item.reelId}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                        <span>Action: <strong style={{ color: 'white' }}>{item.interactionType}</strong></span>
                        <span>&bull;</span>
                        <span>Duration: {item.watchDuration}s</span>
                        <span>&bull;</span>
                        <span>Timestamp: {new Date(item.timestamp || Date.now()).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isHigh ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                        {completionPct}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completion</div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      {item.liked && <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', borderRadius: '4px', fontWeight: 700 }}>Liked</span>}
                      {item.saved && <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', borderRadius: '4px', fontWeight: 700 }}>Saved</span>}
                      {item.shared && <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)', borderRadius: '4px', fontWeight: 700 }}>Shared</span>}
                      {item.skipped && <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>Skipped</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Film, Heart, Bookmark, Share2, SkipForward, CheckCircle2, Play, Pause, Sparkles, Tag, Eye } from 'lucide-react';
import apiClient from '../services/api';

export const ReelFeedTab = ({ onInteract, userId = 'student_tech_curious_01' }) => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  const fetchReels = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/reels');
      if (res.data.success) {
        setReels(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load reels feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleAction = async (reel, actionType) => {
    const watchDuration = actionType === 'SKIP' ? 3 : reel.duration;
    const completionRate = actionType === 'SKIP' ? 0.08 : 1.0;

    setToastMessage(`Logged ${actionType} on "${reel.title.slice(0, 30)}..." (+telemetry recorded)`);
    setTimeout(() => setToastMessage(null), 3000);

    if (onInteract) {
      onInteract(reel.reelId, actionType);
    }
  };

  const categories = ['ALL', ...new Set(reels.map((r) => r.category))];
  const filteredReels =
    activeCategory === 'ALL'
      ? reels
      : reels.filter((r) => r.category === activeCategory);

  return (
    <div>
      {/* Feed Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Student Short-Form Tech Reel Feed</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Simulate watch interactions to train and refine the student’s real-time interest profile
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.8rem',
                borderRadius: '9999px',
                border: '1px solid var(--border-subtle)',
                background: activeCategory === cat ? 'var(--accent-indigo)' : 'var(--bg-surface)',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Action Feedback Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100,
            background: '#0f172a',
            border: '1px solid var(--accent-cyan)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-cyan)',
            fontWeight: 600,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Sparkles size={16} />
          {toastMessage}
        </div>
      )}

      {/* Reel Feed Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading Reel Feed from MongoDB...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredReels.map((reel) => (
            <div
              key={reel.reelId}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
            >
              <div>
                {/* Simulated Video Frame Header */}
                <div
                  style={{
                    height: '140px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.5rem',
                        background: 'rgba(0, 0, 0, 0.6)',
                        color: 'var(--accent-cyan)',
                        borderRadius: '4px',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {reel.category}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        background: 'rgba(0, 0, 0, 0.6)',
                        color: 'var(--text-muted)',
                        borderRadius: '4px',
                      }}
                    >
                      ⏱️ {reel.duration}s
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <Play size={20} fill="white" />
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    @{reel.creator} &bull; {reel.platform}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {reel.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  {reel.description}
                </p>

                {/* Topics */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {(reel.topics || []).slice(0, 4).map((top) => (
                    <span
                      key={top}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.45rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      #{top}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Telemetry Action Buttons */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={() => handleAction(reel, 'LIKE')}
                  title="Like (+3)"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    color: 'var(--accent-rose)',
                    fontWeight: 600,
                  }}
                >
                  <Heart size={15} /> Like
                </button>

                <button
                  onClick={() => handleAction(reel, 'SAVE')}
                  title="Save / Bookmark (+4)"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    color: 'var(--accent-amber)',
                    fontWeight: 600,
                  }}
                >
                  <Bookmark size={15} /> Save
                </button>

                <button
                  onClick={() => handleAction(reel, 'SHARE')}
                  title="Share (+5)"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    color: 'var(--accent-indigo)',
                    fontWeight: 600,
                  }}
                >
                  <Share2 size={15} /> Share
                </button>

                <button
                  onClick={() => handleAction(reel, 'SKIP')}
                  title="Skip (-2)"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                  }}
                >
                  <SkipForward size={15} /> Skip
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

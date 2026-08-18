import React, { useEffect, useState } from 'react';
import { Film, Sparkles, BookOpen, Wrench, Award, Tag, Check, Eye, Heart, Bookmark, Share2 } from 'lucide-react';
import apiClient from '../services/api';

export const ReelCatalog = ({ onInteract }) => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await apiClient.get('/api/reels');
        if (response.data.success) {
          setReels(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch reels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const categories = ['ALL', ...new Set(reels.map((r) => r.category))];

  const filteredReels =
    selectedCategory === 'ALL'
      ? reels
      : reels.filter((r) => r.category === selectedCategory);

  return (
    <div className="glass-panel card-content" style={{ marginTop: '2rem' }}>
      <div className="card-header-flex">
        <div className="card-title-group">
          <div className="card-icon-box blue">
            <Film size={20} />
          </div>
          <div>
            <h3>Seeded Reel Catalog ({reels.length} Reels)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Fictional short-form dataset with multidimensional technology scores
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontSize: '0.75rem',
                padding: '0.3rem 0.7rem',
                borderRadius: '9999px',
                border: '1px solid var(--border-subtle)',
                background: selectedCategory === cat ? 'var(--accent-indigo)' : 'var(--bg-surface)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading Reel Dataset from MongoDB...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginTop: '1.5rem',
          }}
        >
          {filteredReels.map((reel) => (
            <div
              key={reel.reelId}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--accent-indigo)',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    {reel.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ⏱️ {reel.duration}s
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {reel.title}
                </h4>

                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.4,
                  }}
                >
                  {reel.description}
                </p>

                {/* Score Indicators */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.4rem',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.75rem',
                    fontSize: '0.75rem',
                  }}
                >
                  <div style={{ color: '#38bdf8' }}>
                    Tech Depth: <strong>{reel.technicalDepth}/10</strong>
                  </div>
                  <div style={{ color: '#34d399' }}>
                    Educational: <strong>{reel.educationalValue}/10</strong>
                  </div>
                  <div style={{ color: '#a78bfa' }}>
                    Career Value: <strong>{reel.careerValue}/10</strong>
                  </div>
                  <div style={{ color: '#fbbf24' }}>
                    Hype Score: <strong>{reel.hypeScore}/10</strong>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                  {reel.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.45rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interaction Quick Bar */}
              {onInteract && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.75rem',
                  }}
                >
                  <button
                    onClick={() => onInteract(reel.reelId, 'LIKE')}
                    title="Like Reel"
                    style={{ color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                  >
                    <Heart size={14} /> Like
                  </button>
                  <button
                    onClick={() => onInteract(reel.reelId, 'SAVE')}
                    title="Save Reel"
                    style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                  >
                    <Bookmark size={14} /> Save
                  </button>
                  <button
                    onClick={() => onInteract(reel.reelId, 'VIEW')}
                    title="Simulate Watch"
                    style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                  >
                    <Eye size={14} /> Watch
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

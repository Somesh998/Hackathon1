import React, { useEffect, useState } from 'react';
import { Sparkles, Film, Award, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import apiClient from '../services/api';

export const RecommendationFeed = ({ userId = 'student_tech_curious_01', reloadTrigger }) => {
  const [recsData, setRecsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/interests/recommendations/${userId}`);
      if (res.data.success) {
        setRecsData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userId, reloadTrigger]);

  return (
    <div className="glass-panel card-content" style={{ marginTop: '2rem' }}>
      <div className="card-header-flex">
        <div className="card-title-group">
          <div className="card-icon-box green">
            <Sparkles size={20} />
          </div>
          <div>
            <h3>Personalized Technology Recommendations</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Candidate ranking driven by inferred broader technology interests (GET /api/interests/recommendations/:userId)
            </p>
          </div>
        </div>

        {recsData?.trapDefenseActive && (
          <span
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <ShieldCheck size={14} /> Trap Defense: Broad Tech Domain Active
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Computing personalized ranking against inferred interest profile...
        </div>
      ) : !recsData || !recsData.recommendations.length ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No recommendations available yet.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginTop: '1rem',
          }}
        >
          {recsData.recommendations.slice(0, 6).map((rec, idx) => (
            <div
              key={rec.reelId}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: 'var(--accent-cyan)',
                      textTransform: 'uppercase',
                    }}
                  >
                    #{idx + 1} &bull; {rec.category}
                  </span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    Match: {Math.round(rec.matchScore * 100)}%
                  </div>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {rec.title}
                </h4>

                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.4,
                  }}
                >
                  💡 <strong>Reason:</strong> {rec.matchReason}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(rec.topics || []).slice(0, 3).map((top) => (
                  <span
                    key={top}
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.15rem 0.4rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '4px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    #{top}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

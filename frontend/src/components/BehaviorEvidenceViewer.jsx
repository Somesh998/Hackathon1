import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, Sparkles, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';
import apiClient from '../services/api';

export const BehaviorEvidenceViewer = ({ userId = 'student_tech_curious_01', reloadTrigger }) => {
  const [evidenceData, setEvidenceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/interests/evidence/${userId}`);
      if (res.data.success) {
        setEvidenceData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load evidence report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [userId, reloadTrigger]);

  return (
    <div className="glass-panel card-content" style={{ marginTop: '2rem' }}>
      <div className="card-header-flex">
        <div className="card-title-group">
          <div className="card-icon-box green">
            <Target size={20} />
          </div>
          <div>
            <h3>Behavioral Interest Evidence Report (Phase 3)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Computed interest evidence synthesized across multiple watch signals
            </p>
          </div>
        </div>

        <button className="refresh-btn" onClick={fetchEvidence} disabled={loading} style={{ fontSize: '0.75rem' }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Signals
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Extracting behavioral evidence from MongoDB...
        </div>
      ) : !evidenceData || !evidenceData.strongestEvidence.length ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No evidence records found for {userId}. Run simulated interactions or interact with reels!
        </div>
      ) : (
        <div>
          {/* Top Inferred Affinities */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Synthesized Topic Affinities (No Naive Keyword Pigeonholing)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(evidenceData.topTopicAffinities || []).slice(0, 7).map((item) => (
                <div
                  key={item.topic}
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span style={{ color: '#a5b4fc', fontWeight: 600 }}>#{item.topic}</span>
                  <span style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 700 }}>
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ranked Evidence Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {evidenceData.strongestEvidence.map((item) => {
              const isVeryHigh = item.evidenceLevel === 'VERY_HIGH';
              const isHigh = item.evidenceLevel === 'HIGH';
              const isNegative = item.evidenceLevel === 'NEGATIVE';

              return (
                <div
                  key={item.reelId}
                  style={{
                    background: isVeryHigh
                      ? 'rgba(16, 185, 129, 0.05)'
                      : isNegative
                      ? 'rgba(244, 63, 94, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isVeryHigh
                      ? '1px solid rgba(16, 185, 129, 0.25)'
                      : isNegative
                      ? '1px solid rgba(244, 63, 94, 0.25)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: isVeryHigh
                            ? 'rgba(16, 185, 129, 0.2)'
                            : isNegative
                            ? 'rgba(244, 63, 94, 0.2)'
                            : 'rgba(59, 130, 246, 0.2)',
                          color: isVeryHigh ? '#34d399' : isNegative ? '#fb7185' : '#60a5fa',
                          marginRight: '0.5rem',
                        }}
                      >
                        {item.evidenceLevel} ({item.evidenceStrength})
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      flexWrap: 'wrap',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span>Completion: <strong>{Math.round(item.signals.avgCompletionRate * 100)}%</strong></span>
                    <span>Views: <strong>{item.signals.viewCount}</strong></span>
                    <span>Likes: <strong>{item.signals.likes}</strong></span>
                    <span>Saves: <strong>{item.signals.saves}</strong></span>
                    <span>Shares: <strong>{item.signals.shares}</strong></span>
                    <span>Skips: <strong>{item.signals.skips}</strong></span>
                    <span>Engagement Score: <strong>{item.signals.totalEngagementScore}</strong></span>
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

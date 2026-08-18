import React from 'react';
import { Sparkles, Award, ShieldCheck, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';
import { ContractRecommendationCard } from '../components/ContractRecommendationCard';

export const RecommendationTab = ({ recommendation, onRegenerate, loading }) => {
  const rankings = recommendation?._metadata?.candidateRankings || [];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Personalized AI Recommendation (Phase 8 Contract)</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Generated via 10-factor candidate scoring, clickbait filtering, and strict output contract validation
        </p>
      </div>

      {/* Hero Contract Card */}
      <div style={{ marginBottom: '2rem' }}>
        <ContractRecommendationCard
          recommendation={recommendation}
          onRegenerate={onRegenerate}
          loading={loading}
        />
      </div>

      {/* Candidate Ranking & Scoring Leaderboard */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>10-Factor Candidate Ranking & Evaluation Audit</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Transparent breakdown of why candidate reels were scored, promoted, or penalized
            </p>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
          >
            {rankings.length || 8} Evaluated Candidates
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {rankings.map((candidate, idx) => (
            <div
              key={candidate.reelId || idx}
              style={{
                background: idx === 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: idx === 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: idx === 0 ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.08)',
                      color: idx === 0 ? '#000000' : 'var(--text-muted)',
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {candidate.category}
                  </span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
                  {candidate.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  💡 {candidate.matchReason}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: idx === 0 ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                  {Math.round(candidate.finalScore * 100)}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {idx === 0 ? '🏆 WINNER' : 'Ranked Candidate'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

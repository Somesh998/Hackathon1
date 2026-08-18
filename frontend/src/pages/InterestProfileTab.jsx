import React from 'react';
import { Compass, Sparkles, ShieldCheck, Layers, Award, CheckCircle2, TrendingUp, BarChart2 } from 'lucide-react';

export const InterestProfileTab = ({ profileData, evidenceData, onForceInfer, inferring }) => {
  const profile = profileData || {
    primaryInterest: 'Software Engineering and Technology',
    confidence: 0.91,
    dominanceFactor: 0.22,
    supportingTopics: ['Programming', 'Software Engineering', 'Developer Career', 'Hardware'],
    reasoning: 'Synthesized from cross-domain signals across programming culture, agile standup humor, technical interviews, and developer workstation hardware.',
  };

  const strongestEvidence = evidenceData?.strongestEvidence || [];

  // Category distribution calculation
  const categoryCounts = {};
  strongestEvidence.forEach((item) => {
    const cat = item.category || 'General Tech';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const totalInteractions = strongestEvidence.length || 4;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Student Technology Interest Profile</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Deep semantic synthesis of student engagement streams, topic graphs, and dominance ratios
          </p>
        </div>

        {onForceInfer && (
          <button className="refresh-btn" onClick={onForceInfer} disabled={inferring}>
            <Sparkles size={14} className={inferring ? 'animate-spin' : ''} />
            {inferring ? 'Re-Inferring Profile...' : 'Force Re-Inference'}
          </button>
        )}
      </div>

      {/* Hero Inferred Profile Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.06em' }}>
            Primary Inferred Technology Domain
          </span>
          <span
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <CheckCircle2 size={14} /> Confidence: {Math.round((profile.confidence || 0.91) * 100)}%
          </span>
        </div>

        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem' }}>
          {profile.primaryInterest}
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            AI Reasoning & Evidence Synthesis
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {profile.reasoning}
          </p>
        </div>

        {/* Supporting Topics */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Supporting Topic Clusters
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(profile.supportingTopics || []).map((topic) => (
              <span
                key={topic}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.8rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#e0e7ff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                #{topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Category Distribution & Evidence Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Category Distribution Chart */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div className="card-icon-box blue" style={{ width: '32px', height: '32px' }}>
              <BarChart2 size={16} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Category Distribution</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalInteractions) * 100);
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    <span>{cat}</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>{pct}% ({count} reels)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--grad-primary)',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Behavioral Evidence Strength Stream */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div className="card-icon-box green" style={{ width: '32px', height: '32px' }}>
              <TrendingUp size={16} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Supporting Behavioral Evidence</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {strongestEvidence.slice(0, 4).map((e, idx) => (
              <div
                key={e.reelId || idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{e.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{e.category}</div>
                </div>

                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background:
                      e.evidenceLevel === 'VERY_HIGH'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(99, 102, 241, 0.2)',
                    color:
                      e.evidenceLevel === 'VERY_HIGH' ? '#34d399' : 'var(--accent-cyan)',
                  }}
                >
                  {e.evidenceLevel || 'HIGH'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

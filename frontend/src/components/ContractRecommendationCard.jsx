import React from 'react';
import { Sparkles, Compass, ShieldCheck, Film, Award, CheckCircle2, ArrowRight, BookOpen, Layers, RefreshCw } from 'lucide-react';

export const ContractRecommendationCard = ({ recommendation, onRegenerate, loading }) => {
  if (!recommendation) return null;

  const {
    currentReel,
    interestDetected,
    why,
    recommendedTechReel,
    category,
    whyThisRecommendation,
    difficulty,
    confidence,
  } = recommendation;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2rem',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        boxShadow: '0 20px 50px -10px rgba(99, 102, 241, 0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AI Recommendation Contract (Phase 8)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Strictly validated 8-factor conceptual output schema
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <ShieldCheck size={14} /> Trap Defense: Protected
          </span>

          {onRegenerate && (
            <button
              className="refresh-btn"
              onClick={onRegenerate}
              disabled={loading}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Generating...' : 'Re-Generate'}
            </button>
          )}
        </div>
      </div>

      {/* Grid of the 8 Contract Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* 1. CURRENT REEL */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            1. CURRENT REEL
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={18} color="var(--accent-indigo)" />
            {currentReel}
          </div>
        </div>

        {/* 2. INTEREST DETECTED */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            2. INTEREST DETECTED
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} color="var(--accent-cyan)" />
            {interestDetected}
          </div>
        </div>
      </div>

      {/* 3. WHY (Reasoning for interest detection) */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
          3. WHY (EVIDENCE SYNTHESIS)
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {why}
        </p>
      </div>

      {/* 4. RECOMMENDED TECH REEL (Hero Card) */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            4. RECOMMENDED TECH REEL
          </div>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 800,
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
            }}
          >
            WINNING CANDIDATE
          </span>
        </div>

        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
          {recommendedTechReel}
        </div>

        {/* 6. WHY THIS RECOMMENDATION */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
            6. WHY THIS RECOMMENDATION
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {whyThisRecommendation}
          </p>
        </div>
      </div>

      {/* Meta Contract Row: 5. CATEGORY, 7. DIFFICULTY, 8. CONFIDENCE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {/* 5. CATEGORY */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            5. CATEGORY
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {category}
          </div>
        </div>

        {/* 7. DIFFICULTY */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            7. DIFFICULTY
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>
            {difficulty}
          </div>
        </div>

        {/* 8. CONFIDENCE */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            8. CONFIDENCE
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: confidence === 'High' ? 'var(--accent-emerald)' : '#fbbf24' }}>
            {confidence}
          </div>
        </div>
      </div>
    </div>
  );
};

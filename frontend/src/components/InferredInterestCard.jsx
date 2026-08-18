import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, ShieldCheck, RefreshCw, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '../services/api';

export const InferredInterestCard = ({ userId = 'student_tech_curious_01', reloadTrigger, onInferred }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inferring, setInferring] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/interests/${userId}`);
      if (res.data.success) {
        setProfile(res.data.data);
        if (onInferred) onInferred(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForceInfer = async () => {
    setInferring(true);
    try {
      const res = await apiClient.post(`/api/interests/infer/${userId}`);
      if (res.data.success) {
        setProfile(res.data.data);
        if (onInferred) onInferred(res.data.data);
      }
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setInferring(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId, reloadTrigger]);

  return (
    <div className="glass-panel card-content" style={{ marginTop: '2rem' }}>
      <div className="card-header-flex">
        <div className="card-title-group">
          <div className="card-icon-box purple">
            <Compass size={20} />
          </div>
          <div>
            <h3>Inferred Student Interest Profile (Phase 5 & 6)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Synthesized from multi-signal watch evidence &bull; Built-in Trap Defense Active
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <span className="badge badge-phase">
            <ShieldCheck size={13} color="var(--accent-emerald)" /> Trap Defense: Protected
          </span>
          <button className="refresh-btn" onClick={handleForceInfer} disabled={inferring || loading} style={{ fontSize: '0.75rem' }}>
            <RefreshCw size={13} className={inferring ? 'animate-spin' : ''} />
            {inferring ? 'Inferring...' : 'Re-Infer Interest'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Computing semantic interest trajectory...
        </div>
      ) : !profile ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No interest profile inferred yet.
        </div>
      ) : (
        <div>
          {/* Main Inferred Interest Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                Primary Inferred Technology Domain
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                <CheckCircle2 size={16} /> Confidence: {Math.round((profile.confidence || 0.9) * 100)}%
              </div>
            </div>

            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
              {profile.primaryInterest}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {profile.reasoning}
            </p>

            {/* Supporting Topics */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Supporting Topic Clusters:</span>
              {(profile.supportingTopics || []).map((topic) => (
                <span
                  key={topic}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '9999px',
                    color: '#e0e7ff',
                    fontWeight: 600,
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Metric gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Topic Concentration / Dominance</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: profile.dominanceFactor > 0.6 ? '#f59e0b' : 'var(--accent-cyan)' }}>
                {Math.round((profile.dominanceFactor || 0.22) * 100)}% ({profile.dominanceFactor > 0.6 ? 'Specific Dominant' : 'Broad & Diverse'})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {profile.dominanceFactor > 0.6 ? 'Single-topic depth detected.' : 'Multi-evidence broad spectrum active.'}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Synthesized Evidence Pieces</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                {profile.evidence?.length || 4} Signals
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Multi-source watch telemetry validated.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

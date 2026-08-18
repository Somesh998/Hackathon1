import React from 'react';
import { Eye, TrendingUp, Compass, Award, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Film, Activity } from 'lucide-react';
import { ContractRecommendationCard } from '../components/ContractRecommendationCard';

export const DashboardTab = ({
  evidenceData,
  profileData,
  recommendation,
  onRegenerate,
  loading,
  setActiveTab,
}) => {
  const totalWatched = evidenceData?.totalInteractions || 5;
  const distinctReels = evidenceData?.distinctReelsInteracted || 4;
  const primaryInterest = profileData?.primaryInterest || 'Software Engineering and Technology';
  const confidenceScore = profileData?.confidence ? Math.round(profileData.confidence * 100) : 91;
  const dominanceFactor = profileData?.dominanceFactor ? Math.round(profileData.dominanceFactor * 100) : 22;

  // Compute average engagement score
  const avgEngagement = evidenceData?.strongestEvidence?.length
    ? Math.round(
        (evidenceData.strongestEvidence.reduce((s, e) => s + (e.signals?.totalEngagementScore || 0.8), 0) /
          evidenceData.strongestEvidence.length) *
          100
      )
    : 84;

  return (
    <div>
      {/* Executive KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* KPI 1: Total Reels Watched */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Reels Watched
            </span>
            <div className="card-icon-box blue" style={{ width: '32px', height: '32px' }}>
              <Eye size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{totalWatched} Reels</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
            {distinctReels} Distinct Topics Tracked
          </div>
        </div>

        {/* KPI 2: Technology Interest Score */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Technology Interest Score
            </span>
            <div className="card-icon-box purple" style={{ width: '32px', height: '32px' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{confidenceScore}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>
            High Semantic Alignment
          </div>
        </div>

        {/* KPI 3: Dominance / Concentration */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Topic Breadth
            </span>
            <div className="card-icon-box green" style={{ width: '32px', height: '32px' }}>
              <Compass size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{dominanceFactor}% Concentration</div>
          <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginTop: '0.25rem' }}>
            Broad Cross-Domain Profile
          </div>
        </div>

        {/* KPI 4: Engagement Score */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Engagement Quality
            </span>
            <div className="card-icon-box green" style={{ width: '32px', height: '32px' }}>
              <Activity size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{avgEngagement}/100</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>
            High Completion & Active Saves
          </div>
        </div>
      </div>

      {/* Hero Recommendation Contract Component */}
      <div style={{ marginBottom: '2rem' }}>
        <ContractRecommendationCard
          recommendation={recommendation}
          onRegenerate={onRegenerate}
          loading={loading}
        />
      </div>

      {/* Secondary Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Top Inferred Interests Card */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top Inferred Tech Interests</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Synthesized from multi-source watch telemetry</p>
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              View Profile <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <span>{primaryInterest}</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{confidenceScore}%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Supporting: {(profileData?.supportingTopics || ['Programming', 'Software Engineering', 'Hardware']).join(', ')}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Cybersecurity & Application Defense</span>
                <span style={{ color: 'var(--accent-emerald)' }}>88%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Supporting: SQL Injection, Auth Security, ORM Defense
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Hardware & Workstation Performance</span>
                <span style={{ color: '#fbbf24' }}>85%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Supporting: Apple Silicon, GPU Benchmarks, Local LLMs
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reel Feed CTA Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div className="card-icon-box purple" style={{ width: '32px', height: '32px' }}>
                <Film size={16} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Interactive Reel Feed</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Interact with sample short-form reels to simulate watch behavior. Liking, saving, or skipping immediately updates the agent’s behavioral telemetry and re-infers interest trajectories in real time.
            </p>
          </div>

          <div>
            <button
              onClick={() => setActiveTab('feed')}
              style={{
                background: 'var(--grad-primary)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              Open Reel Feed Player <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

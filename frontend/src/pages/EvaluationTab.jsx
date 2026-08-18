import React, { useState, useEffect } from 'react';
import { BarChart3, ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import apiClient from '../services/api';

export const EvaluationTab = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBenchmark = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/evaluation/benchmark');
      if (res.data.success) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load benchmark report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmark();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>System Evaluation & Benchmark Framework (Phase 11)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Comparative evaluation across 10 fictional student personas: Keyword Baseline vs. AI Recommendation Agent
          </p>
        </div>

        <button className="refresh-btn" onClick={fetchBenchmark} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Running Benchmark...' : 'Re-Run Benchmark'}
        </button>
      </div>

      {loading || !report ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Evaluating 10 student interaction scenarios against Baseline and AI System...
        </div>
      ) : (
        <div>
          {/* Executive Metrics Overview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Interest Inference Accuracy
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {report.summaryMetrics.interestInferenceAccuracy.aiSystem}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
                vs {report.summaryMetrics.interestInferenceAccuracy.baseline} Baseline ({report.summaryMetrics.interestInferenceAccuracy.improvement})
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Recommendation Relevance
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {report.summaryMetrics.recommendationRelevance.aiSystem}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
                vs {report.summaryMetrics.recommendationRelevance.baseline} Baseline ({report.summaryMetrics.recommendationRelevance.improvement})
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Category Diversity
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>
                {report.summaryMetrics.categoryDiversity.aiSystem}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginTop: '0.25rem' }}>
                vs {report.summaryMetrics.categoryDiversity.baseline} Baseline ({report.summaryMetrics.categoryDiversity.improvement})
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Hype / Clickbait Filter
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                {report.summaryMetrics.hypeRejectionRate.aiSystem}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Strict P_hype Penalty Active
              </div>
            </div>
          </div>

          {/* 10 Persona Comparison Table */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>10 Student Persona Evaluation Results</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Direct side-by-side comparison illustrating AI superiority over naive keyword matching
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {report.comparisons.map((c, idx) => (
                <div
                  key={c.scenarioId}
                  style={{
                    background: c.isTrapCase ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: c.isTrapCase ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>{c.personaName}</span>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{c.description}</p>
                    </div>

                    {c.isTrapCase && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          background: 'var(--accent-emerald)',
                          color: '#000000',
                        }}
                      >
                        🛡️ BUILT-IN TRAP BENCHMARK
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {/* Baseline Column */}
                    <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Baseline (Keyword Matching)
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
                        Inferred: {c.baseline.inferredInterest}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Category: {c.baseline.recommendedCategory} &bull; Trap: {c.baseline.trapAvoided ? '✅ Passed' : '❌ Failed (Overfit)'}
                      </div>
                    </div>

                    {/* AI System Column */}
                    <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        AI Recommendation Agent (Our System)
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700 }}>
                        Inferred: {c.aiSystem.inferredInterest}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                        Category: {c.aiSystem.recommendedCategory} &bull; Confidence: {c.aiSystem.confidence} &bull; Trap: {c.aiSystem.trapAvoided ? '✅ Protected' : '❌ Failed'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

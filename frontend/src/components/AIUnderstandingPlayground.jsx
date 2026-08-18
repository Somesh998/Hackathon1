import React, { useState } from 'react';
import { Brain, Sparkles, Send, CheckCircle2, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import apiClient from '../services/api';

export const AIUnderstandingPlayground = () => {
  const [customTitle, setCustomTitle] = useState('Java developer struggles during Monday morning standup');
  const [customDesc, setCustomDesc] = useState('POV: Blockers everywhere and sprint ticket incomplete #codinghumor');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (presetTitle = null, presetDesc = null) => {
    const titleToUse = presetTitle || customTitle;
    const descToUse = presetDesc || customDesc;

    if (presetTitle) setCustomTitle(presetTitle);
    if (presetDesc) setCustomDesc(presetDesc);

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/reels/analyze', {
        title: titleToUse,
        description: descToUse,
        topics: ['technology'],
      });
      if (response.data.success) {
        setAnalysisResult(response.data.data);
      }
    } catch (err) {
      console.error('Semantic Analysis error:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel card-content" style={{ marginTop: '2rem' }}>
      <div className="card-header-flex">
        <div className="card-title-group">
          <div className="card-icon-box purple">
            <Brain size={20} />
          </div>
          <div>
            <h3>AI Reel Understanding Playground (Phase 4)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Non-keyword semantic analysis resolving intent, domain, and workplace context
            </p>
          </div>
        </div>

        <span className="badge badge-phase">
          <Sparkles size={13} /> Strict Output Schema Enforced
        </span>
      </div>

      {/* Preset Example Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <button
          className="refresh-btn"
          style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
          onClick={() =>
            handleAnalyze(
              'Java developer struggles during Monday morning standup',
              'POV: Blockers everywhere and sprint ticket incomplete #codinghumor'
            )
          }
        >
          ☕ Try "Monday Morning Standup"
        </button>
        <button
          className="refresh-btn"
          style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
          onClick={() =>
            handleAnalyze(
              '5 laptops every programmer should buy in 2025',
              'M3 Max vs ThinkPad benchmarks for Docker and local LLMs'
            )
          }
        >
          💻 Try "5 Laptops for Programmers"
        </button>
        <button
          className="refresh-btn"
          style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
          onClick={() =>
            handleAnalyze(
              'How SQL Injection Works in 30 Seconds',
              'Visual demonstration of parameterized queries vs raw string concatenation'
            )
          }
        >
          🛡️ Try "SQL Injection Breakdown"
        </button>
      </div>

      {/* Input fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Reel Title"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 1rem',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
          }}
        />
        <input
          type="text"
          value={customDesc}
          onChange={(e) => setCustomDesc(e.target.value)}
          placeholder="Reel Description / Transcript excerpt"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 1rem',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
          }}
        />
        <div>
          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !customTitle.trim()}
            style={{
              background: 'var(--grad-primary)',
              color: 'white',
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Sparkles size={16} />
            {loading ? 'Analyzing Semantics...' : 'Run Semantic Understanding'}
          </button>
        </div>
      </div>

      {/* Results View */}
      {error && (
        <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', padding: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      {analysisResult && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>Inferred Domain</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{analysisResult.domain}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Primary Topic</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{analysisResult.primaryTopic}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Intent</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{analysisResult.intent}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Context</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{analysisResult.context}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--accent-indigo)' }}>🧠 Semantic Reasoning:</strong> {analysisResult.reasoning}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secondary Topics:</span>
            {analysisResult.secondaryTopics.map((top) => (
              <span
                key={top}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                #{top}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

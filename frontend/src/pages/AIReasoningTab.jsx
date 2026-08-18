import React from 'react';
import { Brain, ShieldCheck, AlertTriangle, Compass, CheckCircle2, ArrowRight, Code, Cpu } from 'lucide-react';
import { AIUnderstandingPlayground } from '../components/AIUnderstandingPlayground';

export const AIReasoningTab = () => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>AI Semantic Reasoning & Trap Defense Engine</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Mathematical formulation and architecture explaining why the agent avoids naive single-topic overfitting
        </p>
      </div>

      {/* Trap Defense Comparison Visualizer */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div className="card-icon-box purple" style={{ width: '36px', height: '36px' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>The Built-In Trap: Keyword Matching vs. AI Inference</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Scenario: Student interacts with [Java meme, Remote SWE lifestyle, DSA joke, Laptop comparison]
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Baseline Engine (Flawed) */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-rose)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <AlertTriangle size={16} /> WEAK / KEYWORD BASELINE
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
              Inferred: "Java"
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              ❌ <strong>Trap Failure:</strong> Overfits blindly to the keyword "Java" from the first meme and spams repetitive Java tutorials, ignoring the lifestyle, interview, and hardware signals.
            </p>
            <div style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
              Action: Recommends <em>"Another Generic Java Syntax Reel"</em>
            </div>
          </div>

          {/* AI Recommendation Agent (Our System) */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={16} /> OUR AI RECOMMENDATION AGENT
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
              Inferred: "Software Engineering / Technology"
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              ✅ <strong>Protected:</strong> Calculates Topic Dominance Ratio R_dom(Java) = 0.21 &lt; 0.35 across positive behavioral evidence weights and synthesizes cross-domain technology interest.
            </p>
            <div style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', color: 'var(--accent-emerald)' }}>
              Action: Recommends <em>"How SQL Injection Works & Parameterized Query Defense"</em>
            </div>
          </div>
        </div>

        {/* Mathematical Dominance Formula */}
        <div style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            📐 Topic Dominance Ratio Formula
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#e0e7ff', marginBottom: '0.5rem' }}>
            R_dom(Topic) = Σ(w_i where Topic ∈ topics(e_i)) / Σ(w_i)
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            &bull; If R_dom &ge; 0.70 and evidence is repeated tutorial code &rarr; Infers <strong>Dominant Specific Depth</strong> (e.g. Specialized Java Development).<br />
            &bull; If R_dom &lt; 0.35 across multiple diverse signals &rarr; Infers <strong>Broader Engineering Interest</strong> (defending against single-topic traps).
          </p>
        </div>
      </div>

      {/* Live AI Semantic Understanding Playground */}
      <AIUnderstandingPlayground />
    </div>
  );
};

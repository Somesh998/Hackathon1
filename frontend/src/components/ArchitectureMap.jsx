import React from 'react';
import { BrainCircuit, Database, Globe, Network, ArrowRight, CheckCircle } from 'lucide-react';

export const ArchitectureMap = () => {
  return (
    <div className="glass-panel card-content">
      <div className="card-header-flex">
        <div className="card-title-group">
          <div className="card-icon-box purple">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3>Multi-Evidence AI Inference Engine</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Non-keyword broad interest inference architecture
            </p>
          </div>
        </div>
      </div>

      <div className="inference-flow">
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <strong>Sample Student Interaction Signals:</strong>
        </div>
        <div className="evidence-chips">
          <span className="evidence-chip">☕ Java Meme</span>
          <span className="evidence-chip">💼 SWE Lifestyle</span>
          <span className="evidence-chip">🎯 LeetCode Joke</span>
          <span className="evidence-chip">💻 Laptop Comparison</span>
        </div>

        <div className="inference-arrow">
          <ArrowRight size={16} />
          <span>Synthesized via Multi-Evidence LLM Reasoning (No Keyword Matching)</span>
          <ArrowRight size={16} />
        </div>

        <div className="inferred-result-card">
          <div className="inferred-title">Inferred Broader Interest Domain</div>
          <div className="inferred-value">Software Engineering / Technology</div>
          <div className="inferred-subtext">
            Avoids narrow single-topic pigeonholing (e.g. recommending only "Java" videos).
          </div>
        </div>
      </div>
    </div>
  );
};

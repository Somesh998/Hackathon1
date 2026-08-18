import React from 'react';
import { Sparkles, ShieldCheck, Layers, Compass } from 'lucide-react';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-group">
          <div className="logo-icon-wrapper">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="logo-title">TechRecommender</h1>
            <p className="logo-subtitle">AI Recommendation Agent for Students</p>
          </div>
        </div>

        <div className="header-badges">
          <span className="badge badge-phase">
            <ShieldCheck size={14} color="var(--accent-emerald)" />
            Phases 1–12 Production Ready
          </span>
          <span className="badge badge-tech">
            <Compass size={14} />
            10-Factor AI Pipeline Active
          </span>
        </div>
      </div>
    </header>
  );
};

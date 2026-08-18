import React from 'react';
import { LayoutDashboard, Film, Compass, Sparkles, History, Brain, BarChart3 } from 'lucide-react';

export const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'feed', label: 'Reel Feed', icon: Film },
    { id: 'recommendation', label: 'Recommendation', icon: Sparkles, highlight: true },
    { id: 'profile', label: 'Interest Profile', icon: Compass },
    { id: 'history', label: 'Interaction History', icon: History },
    { id: 'reasoning', label: 'AI Reasoning', icon: Brain },
    { id: 'evaluation', label: 'Evaluation & Benchmarks', icon: BarChart3 },
  ];

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              background: isActive
                ? tab.highlight
                  ? 'var(--grad-primary)'
                  : 'rgba(99, 102, 241, 0.2)'
                : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              border: isActive
                ? tab.highlight
                  ? 'none'
                  : '1px solid rgba(99, 102, 241, 0.4)'
                : '1px solid transparent',
              boxShadow: isActive && tab.highlight ? '0 0 20px rgba(99, 102, 241, 0.35)' : 'none',
            }}
          >
            <Icon size={16} color={isActive ? '#ffffff' : 'currentColor'} />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

import React from 'react';
import { Activity, RefreshCw, CheckCircle2, AlertTriangle, Clock, Server } from 'lucide-react';
import { useHealth } from '../hooks/useHealth';

export const HealthCard = () => {
  const { healthData, loading, error, latency, lastChecked, refetch } = useHealth(false);

  const isOnline = Boolean(healthData && healthData.success);

  return (
    <div className="glass-panel card-content">
      <div className="card-header-flex">
        <div className="card-title-group">
          <div className={`card-icon-box ${isOnline ? 'green' : error ? 'purple' : 'blue'}`}>
            <Activity size={20} />
          </div>
          <div>
            <h3>API Gateway Health</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real-time connectivity to Express backend
            </p>
          </div>
        </div>

        <div className={`health-status-badge ${isOnline ? 'online' : error ? 'offline' : 'checking'}`}>
          <span className="pulse-dot" />
          {loading ? 'Checking...' : isOnline ? 'Online (200 OK)' : 'Offline / Error'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Server size={15} color="var(--accent-cyan)" />
          <span>Endpoint: <strong>GET /api/health</strong></span>
        </div>
        {latency !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Clock size={15} color="var(--accent-emerald)" />
            <span>Latency: <strong>{latency} ms</strong></span>
          </div>
        )}
      </div>

      <div className="json-preview">
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
          // Response payload from backend:
        </div>
        <pre>
          {loading && !healthData
            ? '// Fetching /api/health...'
            : JSON.stringify(
                healthData || {
                  success: false,
                  error: typeof error === 'object' ? error : { message: String(error) },
                },
                null,
                2
              )}
        </pre>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {lastChecked ? `Last pinged at ${lastChecked}` : 'Initializing ping...'}
        </span>
        <button className="refresh-btn" onClick={refetch} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Pinging...' : 'Ping API Again'}
        </button>
      </div>
    </div>
  );
};

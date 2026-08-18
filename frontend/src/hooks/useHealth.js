import { useState, useEffect, useCallback } from 'react';
import { checkHealth } from '../services/api';

export const useHealth = (autoPoll = false, pollInterval = 10000) => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    const result = await checkHealth();
    
    if (result.success) {
      setHealthData(result.data);
      setError(null);
    } else {
      setError(result.error);
      setHealthData(null);
    }

    setLatency(result.latency);
    setLastChecked(new Date().toLocaleTimeString());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHealth();

    if (!autoPoll) return;

    const interval = setInterval(() => {
      fetchHealth();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [fetchHealth, autoPoll, pollInterval]);

  return {
    healthData,
    loading,
    error,
    latency,
    lastChecked,
    refetch: fetchHealth,
  };
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
};

export const PHASES = [
  { id: 1, name: 'Project Initialization', status: 'completed' },
  { id: 2, name: 'Data Pipeline & Seed Schema', status: 'pending' },
  { id: 3, name: 'Student Interaction Tracking', status: 'pending' },
  { id: 4, name: 'Multi-Evidence Interest Inference', status: 'pending' },
  { id: 5, name: 'Semantic LLM Analysis', status: 'pending' },
  { id: 6, name: 'Recommendation Engine', status: 'pending' },
  { id: 7, name: 'Student Feed & Reel Player UI', status: 'pending' },
  { id: 8, name: 'Performance & Latency Optimization', status: 'pending' },
  { id: 9, name: 'Evaluation & Final Delivery', status: 'pending' },
];

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Health check API service
 */
export const checkHealth = async () => {
  const startTime = performance.now();
  try {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH);
    const latency = Math.round(performance.now() - startTime);
    return {
      success: true,
      data: response.data,
      latency,
      status: response.status,
    };
  } catch (error) {
    const latency = Math.round(performance.now() - startTime);
    return {
      success: false,
      error: error.response?.data || error.message,
      latency,
      status: error.response?.status || 500,
    };
  }
};

export default apiClient;

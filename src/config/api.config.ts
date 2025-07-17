export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  apiKey: import.meta.env.VITE_API_KEY,
  apiSecret: import.meta.env.VITE_API_SECRET,
  timeout: 30000,
};

// Validasi environment variables
if (!API_CONFIG.baseURL) {
  throw new Error('VITE_API_BASE_URL is required');
}
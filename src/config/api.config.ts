// src/config/api.config.ts
interface ApiConfig {
  baseURL: string;
  rupApiPath: string;
  rupApiKey: string;
  rupApiSecret: string;
  timeout: number;
  enableRateLimit: boolean;
  maxRequestsPerHour: number;
  environment: 'development' | 'staging' | 'production';
}

// Validasi environment variables saat aplikasi dimulai
const validateEnvVars = (): void => {
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_RUP_API_PATH',
    'VITE_RUP_API_KEY', 
    'VITE_RUP_API_SECRET'
  ];

  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }
};

// Panggil validasi
validateEnvVars();

export const API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  rupApiPath: import.meta.env.VITE_RUP_API_PATH,
  rupApiKey: import.meta.env.VITE_RUP_API_KEY,
  rupApiSecret: import.meta.env.VITE_RUP_API_SECRET,
  timeout: 30000,
  enableRateLimit: import.meta.env.VITE_ENABLE_RATE_LIMITING === 'true',
  maxRequestsPerHour: parseInt(import.meta.env.VITE_MAX_REQUESTS_PER_HOUR || '100'),
  environment: (import.meta.env.VITE_ENVIRONMENT || 'development') as ApiConfig['environment'],
};

// Untuk development, log konfigurasi (tanpa sensitive data)
if (API_CONFIG.environment === 'development') {
  console.log('API Configuration loaded:', {
    baseURL: API_CONFIG.baseURL,
    environment: API_CONFIG.environment,
    timeout: API_CONFIG.timeout,
    enableRateLimit: API_CONFIG.enableRateLimit,
    maxRequestsPerHour: API_CONFIG.maxRequestsPerHour,
    // JANGAN log API keys atau secrets
    rupApiKey: API_CONFIG.rupApiKey ? '***configured***' : 'missing',
    rupApiSecret: API_CONFIG.rupApiSecret ? '***configured***' : 'missing',
  });
}
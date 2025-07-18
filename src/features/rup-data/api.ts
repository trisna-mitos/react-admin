// 1. QUICK FIX: Update src/features/rup-data/api.ts (untuk testing dulu)
import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';
import type { RupItem } from './types';

// Sementara gunakan URL yang sudah working, nanti kita secure step by step
const buildRupApiUrl = (params: {
  tahun?: number;
  kd_satker?: string;
  tipe?: string;
} = {}) => {
  const { tahun = 2025, kd_satker = 'D112', tipe = '4:12' } = params;
  
  // Gunakan path dari environment variable (yang berisi API key secret)
  const basePath = API_CONFIG.rupApiPath;
  const endpoint = `/RUP-PaketPenyedia-Terumumkan/tipe/${tipe}/parameter/${tahun}:${kd_satker}`;
  
  // Untuk development, gunakan proxy
  if (API_CONFIG.environment === 'development') {
    return `/rup-api${basePath}${endpoint}`;
  }
  
  // Untuk production, gunakan full URL
  return `${API_CONFIG.baseURL}${basePath}${endpoint}`;
};
export async function fetchRupData(params: {
  tahun?: number;
  kd_satker?: string;
  tipe?: string;
} = {}): Promise<RupItem[]> {
  try {
    const RUP_API_URL = buildRupApiUrl(params);
    console.log('🚀 Fetching RUP data from:', RUP_API_URL);
    
    const response = await axios.get<RupItem[]>(RUP_API_URL, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    console.log('✅ Response received:', {
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : 'not array',
      dataType: typeof response.data
    });
    
    if (!Array.isArray(response.data)) {
      console.error('❌ Invalid data format:', response.data);
      throw new Error('Invalid data format: expected array');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('❌ API Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      }
    });
    
    // Specific error messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server took too long to respond');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint not found - check URL configuration');
    } else if (error.response?.status === 403) {
      throw new Error('Access forbidden - check API credentials');
    } else if (error.response?.status === 500) {
      throw new Error('Server error - please try again later');
    } else if (!error.response) {
      throw new Error('Network error - check internet connection and proxy settings');
    }
    
    throw new Error(`Failed to fetch RUP data: ${error.message}`);
  }
}
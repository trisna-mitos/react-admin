// src/features/rup-data/api.ts (Updated dengan API path dari environment)
import { apiClient } from '../../shared/services/api/client';
import { API_CONFIG } from '../../config/api.config';
import type { RupItem } from './types';

// Build URL dengan path yang aman dari environment variables
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

// Enhanced API functions dengan error handling dan logging
export async function fetchRupData(params: {
  tahun?: number;
  kd_satker?: string;
  tipe?: string;
} = {}): Promise<RupItem[]> {
  try {
    const url = buildRupApiUrl(params);
    
    // Log request dalam development (tanpa expose sensitive path)
    if (API_CONFIG.environment === 'development') {
      console.log(`🚀 Fetching RUP data with params:`, params);
      console.log(`🔗 Using secure API path: [PROTECTED]`);
    }

    // Gunakan secure API client yang sudah ada interceptors
    const response = await apiClient.get<RupItem[]>(url);
    
    // Validasi response data
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid data format: expected array');
    }

    // Log success dalam development
    if (API_CONFIG.environment === 'development') {
      console.log(`✅ RUP data fetched successfully: ${response.data.length} items`);
    }

    return response.data;
  } catch (error: any) {
    // Enhanced error handling
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to fetch RUP data';
    
    // Log error dengan detail (tanpa expose sensitive info)
    console.error('❌ RUP API Error:', {
      message: errorMessage,
      status: error.response?.status,
      params,
      // JANGAN log URL atau path yang mengandung API secret
      hasApiPath: !!API_CONFIG.rupApiPath,
      hasApiKey: !!API_CONFIG.rupApiKey,
    });

    // Throw error dengan message yang user-friendly
    throw new Error(errorMessage);
  }
}

// Fungsi tambahan untuk search RUP by specific criteria
export async function searchRupData(searchParams: {
  searchTerm?: string;
  satker?: string;
  metode?: string;
  tahun?: number;
}): Promise<RupItem[]> {
  try {
    const { searchTerm, satker, metode, tahun } = searchParams;
    
    // Fetch base data
    const allData = await fetchRupData({ tahun });
    
    // Filter data berdasarkan search criteria
    let filteredData = allData;
    
    if (searchTerm) {
      filteredData = filteredData.filter(item => 
        item.nama_paket?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_satker?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (satker) {
      filteredData = filteredData.filter(item => 
        item.nama_satker?.toLowerCase().includes(satker.toLowerCase())
      );
    }
    
    if (metode) {
      filteredData = filteredData.filter(item => 
        item.metode_pengadaan?.toLowerCase().includes(metode.toLowerCase())
      );
    }

    if (API_CONFIG.environment === 'development') {
      console.log(`🔍 Search results: ${filteredData.length}/${allData.length} items`);
    }

    return filteredData;
  } catch (error) {
    console.error('❌ Search RUP Error:', error);
    throw error;
  }
}

// Fungsi untuk get RUP by specific kode_rup
export async function getRupByKode(kd_rup: string): Promise<RupItem | null> {
  try {
    const allData = await fetchRupData();
    const item = allData.find(rup => rup.kd_rup === kd_rup);
    
    if (API_CONFIG.environment === 'development') {
      console.log(`🔍 Find RUP by kode ${kd_rup}:`, item ? 'found' : 'not found');
    }
    
    return item || null;
  } catch (error) {
    console.error(`❌ Get RUP by kode ${kd_rup} Error:`, error);
    throw error;
  }
}

// Export API configuration untuk debugging
export const rupApiConfig = {
  buildUrl: buildRupApiUrl,
  environment: API_CONFIG.environment,
  // Jangan expose sensitive data
  hasApiKey: !!API_CONFIG.rupApiKey,
  hasApiSecret: !!API_CONFIG.rupApiSecret,
};
import { apiClient } from '../../../services/api/client';
import type { RupApiParams, RupApiResponse, ApiError } from '../types';

const RUP_BASE_PATH = '/rup-api/isb-2/api/ce33a5db-a6fc-4490-899e-35e84c231452/json/16357';

export const rupApi = {
  async fetchRupData(params: RupApiParams = {}): Promise<RupApiResponse[]> {
    const { tahun = 2025, kd_satker = 'D112', tipe = '4:12' } = params;
    const url = `${RUP_BASE_PATH}/RUP-PaketPenyedia-Terumumkan/tipe/${tipe}/parameter/${tahun}:${kd_satker}`;
    
    try {
      const response = await apiClient.get(url, {
        timeout: 30000,
      });

      if (!Array.isArray(response.data)) {
        throw new Error('Format data tidak valid');
      }
      
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Gagal mengambil data RUP',
        status: error.response?.status?.toString(),
      };
      throw apiError;
    }
  },

  async fetchRupById(kd_rup: string, params: RupApiParams = {}): Promise<RupApiResponse | null> {
    const allData = await this.fetchRupData(params);
    return allData.find(item => item.kd_rup === kd_rup) || null;
  },
};
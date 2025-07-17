import axios from 'axios';
import type { RupItem } from './types';

const RUP_API_URL = '/rup-api/isb-2/api/ce33a5db-a6fc-4490-899e-35e84c231452/json/16357/RUP-PaketPenyedia-Terumumkan/tipe/4:12/parameter/2025:D112';

export async function fetchRupData(): Promise<RupItem[]> {
  try {
    const response = await axios.get<RupItem[]>(RUP_API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch RUP data');
  }
}
import axios, {type AxiosResponse} from 'axios';
import type { RupApiParams, RupApiResponse ,ApiError} from './types';
const RUP_BASE_URL = '/rup-api/isb-2/api/ce33a5db-a6fc-4490-899e-35e84c231452/json/16357';

class RupApiService {

    private static instance : RupApiService;

    static getInstance(): RupApiService{
        if (!RupApiService.instance){
            RupApiService.instance = new RupApiService();
        }
        return RupApiService.instance;
    }

    async getRupData(params : RupApiParams = {}): Promise<RupApiResponse[]>{
        try {
            const { tahun = 2025 , kd_satker = 'D112', tipe = '4:12' } = params;
            const url = `${RUP_BASE_URL}/RUP-PaketPenyedia-Terumumkan/tipe/${tipe}/parameter/${tahun}:${kd_satker}`;
            const response: AxiosResponse<RupApiResponse[]>=await axios.get(
                url,
                {
                    timeout:30000,
                    headers:{
                        'Content-Type' : 'application/json',
                    }
                }
            );

            if (!Array.isArray(response.data)){
                throw new Error('Format data tidak valid');
            }
            return response.data;
        }catch(error){
            if (axios.isAxiosError(error)){
                const apiError : ApiError = {
                    message : error.response?.data?.message || 'Gagal mengambil data RUP',
                    status : error.response?.status.toString()
                }
                throw apiError;
            }
            throw new Error('Terjadi kesalahan tidak terduga');
        }
    }

    async getRupByKodeRup(kd_rup:string): Promise<RupApiResponse | null>{
        try{
            const allData = await this.getRupData();
            return allData.find(item => item.kd_rup === kd_rup )||null;
        }catch(error){
            throw error;
        }
    }
}

export const RunApiService = RupApiService.getInstance();
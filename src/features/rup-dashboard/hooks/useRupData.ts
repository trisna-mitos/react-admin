import { useQuery } from '@tanstack/react-query';
import { rupApi } from '../services/rupApi';
import type { RupApiParams } from '../types';

export const useRupData = (params: RupApiParams = {}) => {
  return useQuery({
    queryKey: ['rup-data', params],
    queryFn: () => rupApi.fetchRupData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export const useRupById = (kd_rup: string, params: RupApiParams = {}) => {
  return useQuery({
    queryKey: ['rup-data', 'detail', kd_rup, params],
    queryFn: () => rupApi.fetchRupById(kd_rup, params),
    enabled: !!kd_rup,
    staleTime: 5 * 60 * 1000,
  });
};
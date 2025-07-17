import { useState, useEffect } from 'react';
import { fetchRupData } from './api';
import type { RupItem } from './types';

export function useRupData() {
  const [data, setData] = useState<RupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await fetchRupData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: loadData
  };
}
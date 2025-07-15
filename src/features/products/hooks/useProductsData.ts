import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories, type FakeStoreProduct } from '../api/productsApi';

export interface UseProductsDataReturn {
  products: FakeStoreProduct[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProductsData(): UseProductsDataReturn {
  const [products, setProducts] = useState<FakeStoreProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products and categories in parallel
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // CRITICAL: Empty dependency array like GetdataPage - NO INFINITE LOOP
  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    products,
    categories,
    loading,
    error,
    refetch
  };
}
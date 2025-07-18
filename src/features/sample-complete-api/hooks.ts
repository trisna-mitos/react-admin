import { useState, useEffect } from 'react';
import { 
  fetchProducts, 
  fetchProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  fetchCategories 
} from './api';
import type { 
  Product, 
  ProductsResponse, 
  ProductCreateRequest, 
  ProductUpdateRequest, 
  ProductSearchParams,
  CategoryItem 
} from './types';

export function useProducts(params: ProductSearchParams = {}) {
  const [data, setData] = useState<ProductsResponse>({
    products: [],
    total: 0,
    skip: 0,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadData = async (searchParams: ProductSearchParams = {}) => {
    try {
      setLoading(true);
      setError('');
      const result = await fetchProducts({ ...params, ...searchParams });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.limit, params.skip, params.category, params.q]);

  return {
    data,
    loading,
    error,
    refetch: loadData
  };
}

export function useProduct(id: number) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await fetchProductById(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  return {
    data,
    loading,
    error,
    refetch: loadData
  };
}

export function useCategories() {
  const [data, setData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await fetchCategories();
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

export function useProductActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const create = async (productData: ProductCreateRequest): Promise<Product | null> => {
    try {
      setLoading(true);
      setError('');
      const result = await createProduct(productData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, productData: Partial<ProductUpdateRequest>): Promise<Product | null> => {
    try {
      setLoading(true);
      setError('');
      const result = await updateProduct(id, productData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError('');
      await deleteProduct(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    create,
    update,
    remove
  };
}
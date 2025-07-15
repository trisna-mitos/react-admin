import { renderHook, waitFor } from '@testing-library/react';
import { useProductsData } from '../hooks/useProductsData';
import * as productsApi from '../api/productsApi';

// Mock the API
jest.mock('../api/productsApi');
const mockedProductsApi = productsApi as jest.Mocked<typeof productsApi>;

describe('useProductsData', () => {
  const mockProducts = [
    {
      id: 1,
      title: 'Test Product 1',
      price: 99.99,
      description: 'Test description 1',
      category: 'electronics',
      image: 'test1.jpg',
      rating: { rate: 4.5, count: 100 }
    },
    {
      id: 2,
      title: 'Test Product 2',
      price: 199.99,
      description: 'Test description 2',
      category: 'clothing',
      image: 'test2.jpg',
      rating: { rate: 3.5, count: 50 }
    }
  ];

  const mockCategories = ['electronics', 'clothing', 'jewelery'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch products and categories successfully', async () => {
    mockedProductsApi.fetchProducts.mockResolvedValueOnce(mockProducts);
    mockedProductsApi.fetchCategories.mockResolvedValueOnce(mockCategories);

    const { result } = renderHook(() => useProductsData());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBe(null);
    expect(mockedProductsApi.fetchProducts).toHaveBeenCalledTimes(1);
    expect(mockedProductsApi.fetchCategories).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch data';
    mockedProductsApi.fetchProducts.mockRejectedValueOnce(new Error(errorMessage));
    mockedProductsApi.fetchCategories.mockResolvedValueOnce(mockCategories);

    const { result } = renderHook(() => useProductsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.products).toEqual([]);
  });

  it('should allow refetching data', async () => {
    mockedProductsApi.fetchProducts
      .mockResolvedValueOnce(mockProducts)
      .mockResolvedValueOnce([...mockProducts, { 
        id: 3, 
        title: 'New Product', 
        price: 299.99, 
        description: 'New description',
        category: 'new-category',
        image: 'new.jpg',
        rating: { rate: 5, count: 1 }
      }]);
    mockedProductsApi.fetchCategories
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce([...mockCategories, 'new-category']);

    const { result } = renderHook(() => useProductsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(2);

    // Trigger refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.products).toHaveLength(3);
    });

    expect(mockedProductsApi.fetchProducts).toHaveBeenCalledTimes(2);
    expect(mockedProductsApi.fetchCategories).toHaveBeenCalledTimes(2);
  });
});
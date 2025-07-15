import axios from 'axios';
import { fetchProducts, fetchCategories, fetchProductById } from '../api/productsApi';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('productsApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Test Product',
          price: 99.99,
          description: 'Test description',
          category: 'electronics',
          image: 'test.jpg',
          rating: { rate: 4.5, count: 100 }
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

      const result = await fetchProducts();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products');
      expect(result).toEqual(mockProducts);
    });

    it('should throw error when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchProducts()).rejects.toThrow('Failed to fetch products: Network error');
    });
  });

  describe('fetchCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockCategories = ['electronics', 'jewelery', 'mens clothing'];

      mockedAxios.get.mockResolvedValueOnce({ data: mockCategories });

      const result = await fetchCategories();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/categories');
      expect(result).toEqual(mockCategories);
    });

    it('should throw error when categories API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchCategories()).rejects.toThrow('Failed to fetch categories: Network error');
    });
  });

  describe('fetchProductById', () => {
    it('should fetch single product successfully', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 }
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

      const result = await fetchProductById(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('should throw error when product not found', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));

      await expect(fetchProductById(999)).rejects.toThrow('Failed to fetch product 999: Not found');
    });
  });
});
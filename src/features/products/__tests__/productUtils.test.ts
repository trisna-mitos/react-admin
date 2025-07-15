import {
  filterProducts,
  sortProducts,
  formatProductPrice,
  formatProductRating,
  getProductRatingColor,
  formatCategoryName,
  getUniqueCategories,
  calculatePriceRange,
  getProductStats
} from '../utils/productUtils';
import type { Product, ProductFilters, ProductSortConfig } from '../types';

describe('productUtils', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 13',
      price: 999,
      description: 'Latest Apple smartphone',
      category: 'electronics',
      image: 'iphone.jpg',
      rating: { rate: 4.5, count: 100 }
    },
    {
      id: 2,
      title: 'Nike Shoes',
      price: 150,
      description: 'Comfortable running shoes',
      category: "men's clothing",
      image: 'shoes.jpg',
      rating: { rate: 3.8, count: 50 }
    },
    {
      id: 3,
      title: 'Samsung Galaxy',
      price: 799,
      description: 'Android smartphone',
      category: 'electronics',
      image: 'samsung.jpg',
      rating: { rate: 4.2, count: 75 }
    }
  ];

  describe('filterProducts', () => {
    it('should filter by search term', () => {
      const filters: ProductFilters = {
        search: 'iphone',
        category: '',
        priceRange: null
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('iPhone 13');
    });

    it('should filter by category', () => {
      const filters: ProductFilters = {
        search: '',
        category: 'electronics',
        priceRange: null
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(2);
      expect(result.every(p => p.category === 'electronics')).toBe(true);
    });

    it('should filter by price range', () => {
      const filters: ProductFilters = {
        search: '',
        category: '',
        priceRange: { min: 200, max: 800 }
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Samsung Galaxy');
    });

    it('should apply multiple filters', () => {
      const filters: ProductFilters = {
        search: 'smartphone',
        category: 'electronics',
        priceRange: { min: 500, max: 1000 }
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(2);
    });
  });

  describe('sortProducts', () => {
    it('should sort by title ascending', () => {
      const sortConfig: ProductSortConfig = {
        field: 'title',
        direction: 'asc'
      };

      const result = sortProducts(mockProducts, sortConfig);
      expect(result[0].title).toBe('iPhone 13');
      expect(result[1].title).toBe('Nike Shoes');
      expect(result[2].title).toBe('Samsung Galaxy');
    });

    it('should sort by price descending', () => {
      const sortConfig: ProductSortConfig = {
        field: 'price',
        direction: 'desc'
      };

      const result = sortProducts(mockProducts, sortConfig);
      expect(result[0].price).toBe(999);
      expect(result[1].price).toBe(799);
      expect(result[2].price).toBe(150);
    });

    it('should sort by rating', () => {
      const sortConfig: ProductSortConfig = {
        field: 'rating',
        direction: 'desc'
      };

      const result = sortProducts(mockProducts, sortConfig);
      expect(result[0].rating.rate).toBe(4.5);
      expect(result[1].rating.rate).toBe(4.2);
      expect(result[2].rating.rate).toBe(3.8);
    });
  });

  describe('formatting functions', () => {
    it('should format product price', () => {
      expect(formatProductPrice(999)).toBe('$999.00');
      expect(formatProductPrice(99.99)).toBe('$99.99');
    });

    it('should format product rating', () => {
      const rating = { rate: 4.5, count: 100 };
      expect(formatProductRating(rating)).toBe('4.5 (100 reviews)');
    });

    it('should get rating color', () => {
      expect(getProductRatingColor(4.5)).toBe('success');
      expect(getProductRatingColor(3.5)).toBe('warning');
      expect(getProductRatingColor(1.5)).toBe('danger');
      expect(getProductRatingColor(0.5)).toBe('default');
    });

    it('should format category name', () => {
      expect(formatCategoryName('electronics')).toBe('Electronics');
      expect(formatCategoryName("men's clothing")).toBe("Men's clothing");
    });
  });

  describe('utility functions', () => {
    it('should get unique categories', () => {
      const categories = getUniqueCategories(mockProducts);
      expect(categories).toEqual(['electronics', "men's clothing"]);
    });

    it('should calculate price range', () => {
      const range = calculatePriceRange(mockProducts);
      expect(range).toEqual({ min: 150, max: 999 });
    });

    it('should handle empty array for price range', () => {
      const range = calculatePriceRange([]);
      expect(range).toEqual({ min: 0, max: 100 });
    });

    it('should get product stats', () => {
      const stats = getProductStats(mockProducts);
      expect(stats.totalProducts).toBe(3);
      expect(stats.highRatedCount).toBe(2); // ratings >= 4
      expect(stats.averageRating).toBe(4.2); // (4.5 + 3.8 + 4.2) / 3 = 4.16...
      expect(stats.averagePrice).toBe(649.33); // (999 + 150 + 799) / 3 = 649.33...
    });
  });
});
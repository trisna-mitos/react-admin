import {
  filterBySearch,
  filterByCategory,
  filterByRange,
  paginateData,
  getTotalPages
} from '../filterUtils';

describe('filterUtils', () => {
  const mockData = [
    { id: 1, name: 'Apple iPhone', category: 'electronics', price: 999 },
    { id: 2, name: 'Nike Shoes', category: 'clothing', price: 150 },
    { id: 3, name: 'Samsung Galaxy', category: 'electronics', price: 799 },
    { id: 4, name: 'Adidas Shirt', category: 'clothing', price: 50 },
    { id: 5, name: 'Sony Headphones', category: 'electronics', price: 299 }
  ];

  describe('filterBySearch', () => {
    it('should filter by search term', () => {
      const result = filterBySearch(mockData, 'iPhone', ['name']);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Apple iPhone');
    });

    it('should search across multiple fields', () => {
      const result = filterBySearch(mockData, 'electronics', ['name', 'category']);
      expect(result).toHaveLength(3);
    });

    it('should be case insensitive', () => {
      const result = filterBySearch(mockData, 'APPLE', ['name']);
      expect(result).toHaveLength(1);
    });

    it('should return all data for empty search', () => {
      const result = filterBySearch(mockData, '', ['name']);
      expect(result).toHaveLength(5);
    });
  });

  describe('filterByCategory', () => {
    it('should filter by category', () => {
      const result = filterByCategory(mockData, 'electronics', 'category');
      expect(result).toHaveLength(3);
      expect(result.every(item => item.category === 'electronics')).toBe(true);
    });

    it('should return all data for empty category', () => {
      const result = filterByCategory(mockData, '', 'category');
      expect(result).toHaveLength(5);
    });
  });

  describe('filterByRange', () => {
    it('should filter by min value', () => {
      const result = filterByRange(mockData, 'price', 200);
      expect(result).toHaveLength(3);
      expect(result.every(item => item.price >= 200)).toBe(true);
    });

    it('should filter by max value', () => {
      const result = filterByRange(mockData, 'price', undefined, 300);
      expect(result).toHaveLength(3);
      expect(result.every(item => item.price <= 300)).toBe(true);
    });

    it('should filter by range', () => {
      const result = filterByRange(mockData, 'price', 100, 800);
      expect(result).toHaveLength(3);
      expect(result.every(item => item.price >= 100 && item.price <= 800)).toBe(true);
    });
  });

  describe('paginateData', () => {
    it('should paginate data correctly', () => {
      const result = paginateData(mockData, 1, 2);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should handle last page with fewer items', () => {
      const result = paginateData(mockData, 3, 2);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(5);
    });

    it('should handle page beyond data length', () => {
      const result = paginateData(mockData, 10, 2);
      expect(result).toHaveLength(0);
    });
  });

  describe('getTotalPages', () => {
    it('should calculate total pages correctly', () => {
      expect(getTotalPages(10, 3)).toBe(4);
      expect(getTotalPages(9, 3)).toBe(3);
      expect(getTotalPages(0, 3)).toBe(0);
    });
  });
});
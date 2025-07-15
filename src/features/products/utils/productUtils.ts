import type { Product, ProductFilters, ProductSortConfig } from '../types';
import { filterBySearch, filterByCategory, filterByRange, sortArray } from '../../../shared/utils/filterUtils';
import { formatCurrency, capitalizeFirst } from '../../../shared/utils/formatUtils';

export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let filtered = products;

  // Apply search filter
  if (filters.search.trim()) {
    filtered = filterBySearch(
      filtered,
      filters.search,
      ['title', 'description', 'category']
    );
  }

  // Apply category filter
  if (filters.category) {
    filtered = filterByCategory(filtered, filters.category, 'category');
  }

  // Apply price range filter
  if (filters.priceRange) {
    filtered = filterByRange(
      filtered,
      'price',
      filters.priceRange.min,
      filters.priceRange.max
    );
  }

  return filtered;
}

export function sortProducts(
  products: Product[],
  sortConfig: ProductSortConfig
): Product[] {
  if (sortConfig.field === 'rating') {
    return [...products].sort((a, b) => {
      const aValue = a.rating.rate;
      const bValue = b.rating.rate;
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }

  return sortArray(products, sortConfig.field, sortConfig.direction);
}

export function formatProductPrice(price: number): string {
  return formatCurrency(price);
}

export function formatProductRating(rating: Product['rating']): string {
  return `${rating.rate.toFixed(1)} (${rating.count} reviews)`;
}

export function getProductRatingColor(rate: number): 'success' | 'warning' | 'danger' | 'default' {
  if (rate >= 4) return 'success';
  if (rate >= 3) return 'warning';
  if (rate >= 2) return 'danger';
  return 'default';
}

export function formatCategoryName(category: string): string {
  return capitalizeFirst(category.replace("'s", "'s"));
}

export function getUniqueCategories(products: Product[]): string[] {
  const categories = products.map(p => p.category);
  return Array.from(new Set(categories));
}

export function calculatePriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 100 };
  
  const prices = products.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

export function getProductStats(products: Product[]) {
  const totalProducts = products.length;
  const highRatedCount = products.filter(p => p.rating.rate >= 4).length;
  const averageRating = products.length > 0 
    ? products.reduce((sum, p) => sum + p.rating.rate, 0) / products.length 
    : 0;
  const averagePrice = products.length > 0
    ? products.reduce((sum, p) => sum + p.price, 0) / products.length
    : 0;

  return {
    totalProducts,
    highRatedCount,
    averageRating: Number(averageRating.toFixed(1)),
    averagePrice: Number(averagePrice.toFixed(2))
  };
}
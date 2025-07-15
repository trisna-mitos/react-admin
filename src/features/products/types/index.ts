export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface ProductFilters {
  search: string;
  category: string;
  priceRange: {
    min: number;
    max: number;
  } | null;
}

export interface ProductSortConfig {
  field: keyof Product | 'rating';
  direction: 'asc' | 'desc';
}

export type ProductColumn = 'image' | 'title' | 'category' | 'price' | 'rating';
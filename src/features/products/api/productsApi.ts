import axios from 'axios';
import { handleApiError } from '../../../shared/utils/apiUtils';

const FAKESTORE_API_BASE = 'https://fakestoreapi.com';

export interface FakeStoreProduct {
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

export async function fetchProducts(): Promise<FakeStoreProduct[]> {
  try {
    const response = await axios.get<FakeStoreProduct[]>(`${FAKESTORE_API_BASE}/products`);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(`Failed to fetch products: ${apiError.message}`);
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await axios.get<string[]>(`${FAKESTORE_API_BASE}/products/categories`);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(`Failed to fetch categories: ${apiError.message}`);
  }
}

export async function fetchProductById(id: number): Promise<FakeStoreProduct> {
  try {
    const response = await axios.get<FakeStoreProduct>(`${FAKESTORE_API_BASE}/products/${id}`);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(`Failed to fetch product ${id}: ${apiError.message}`);
  }
}
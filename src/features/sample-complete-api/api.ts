import axios from 'axios';
import type { 
  Product, 
  ProductsResponse, 
  ProductCreateRequest, 
  ProductUpdateRequest, 
  ProductSearchParams,
  CategoryItem 
} from './types';

const DUMMY_JSON_BASE_URL = 'https://dummyjson.com';

const buildProductApiUrl = (endpoint: string) => {
  return `${DUMMY_JSON_BASE_URL}${endpoint}`;
};

export async function fetchProducts(params: ProductSearchParams = {}): Promise<ProductsResponse> {
  try {
    const { limit = 10, skip = 0, q, category, sortBy, order } = params;
    
    let endpoint = `/products`;
    const queryParams = new URLSearchParams();
    
    if (q) {
      endpoint = `/products/search`;
      queryParams.append('q', q);
    } else if (category) {
      endpoint = `/products/category/${category}`;
    }
    
    if (limit) queryParams.append('limit', limit.toString());
    if (skip) queryParams.append('skip', skip.toString());
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (order) queryParams.append('order', order);
    
    const url = buildProductApiUrl(endpoint + (queryParams.toString() ? `?${queryParams.toString()}` : ''));
    console.log('🚀 Fetching products from:', url);
    
    const response = await axios.get<ProductsResponse>(url, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    console.log('✅ Response received:', {
      status: response.status,
      total: response.data.total,
      productsLength: response.data.products?.length || 0,
      dataType: typeof response.data
    });
    
    if (!response.data.products || !Array.isArray(response.data.products)) {
      console.error('❌ Invalid data format:', response.data);
      throw new Error('Invalid data format: expected products array');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('❌ API Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      }
    });
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server took too long to respond');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint not found - check URL configuration');
    } else if (error.response?.status === 403) {
      throw new Error('Access forbidden - check API credentials');
    } else if (error.response?.status === 500) {
      throw new Error('Server error - please try again later');
    } else if (!error.response) {
      throw new Error('Network error - check internet connection');
    }
    
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
}

export async function fetchProductById(id: number): Promise<Product> {
  try {
    const url = buildProductApiUrl(`/products/${id}`);
    console.log('🚀 Fetching product by ID:', url);
    
    const response = await axios.get<Product>(url, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    console.log('✅ Product response received:', {
      status: response.status,
      productId: response.data.id,
      productTitle: response.data.title
    });
    
    return response.data;
  } catch (error: any) {
    console.error('❌ API Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data
    });
    
    if (error.response?.status === 404) {
      throw new Error('Product not found');
    }
    
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
}

export async function createProduct(productData: ProductCreateRequest): Promise<Product> {
  try {
    const url = buildProductApiUrl('/products/add');
    console.log('🚀 Creating product:', url);
    
    const response = await axios.post<Product>(url, productData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ Product created:', {
      status: response.status,
      productId: response.data.id,
      productTitle: response.data.title
    });
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Create product error:', {
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data
    });
    
    throw new Error(`Failed to create product: ${error.message}`);
  }
}

export async function updateProduct(id: number, productData: Partial<ProductUpdateRequest>): Promise<Product> {
  try {
    const url = buildProductApiUrl(`/products/${id}`);
    console.log('🚀 Updating product:', url);
    
    const response = await axios.put<Product>(url, productData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ Product updated:', {
      status: response.status,
      productId: response.data.id,
      productTitle: response.data.title
    });
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Update product error:', {
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data
    });
    
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

export async function deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
  try {
    const url = buildProductApiUrl(`/products/${id}`);
    console.log('🚀 Deleting product:', url);
    
    const response = await axios.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(url, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ Product deleted:', {
      status: response.status,
      productId: response.data.id,
      isDeleted: response.data.isDeleted
    });
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Delete product error:', {
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data
    });
    
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    const url = buildProductApiUrl('/products/categories');
    console.log('🚀 Fetching categories:', url);
    
    const response = await axios.get<CategoryItem[]>(url, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    console.log('✅ Categories response received:', {
      status: response.status,
      categoriesLength: Array.isArray(response.data) ? response.data.length : 'not array'
    });
    
    if (!Array.isArray(response.data)) {
      console.error('❌ Invalid categories format:', response.data);
      throw new Error('Invalid categories format: expected array');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Categories API Error:', {
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data
    });
    
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
}
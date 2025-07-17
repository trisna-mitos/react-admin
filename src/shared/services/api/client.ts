import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { API_CONFIG } from '../../../config/api.config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        // Tambahkan API key di header jika diperlukan
        ...(API_CONFIG.apiKey && { 'X-API-Key': API_CONFIG.apiKey }),
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Tambahkan signature atau encryption jika diperlukan
        if (API_CONFIG.apiSecret) {
          // Implementasi signature atau encryption
          config.headers['X-API-Signature'] = this.generateSignature(config);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private generateSignature(config: any): string {
    // Implementasi signature generation
    // Contoh sederhana dengan timestamp
    const timestamp = Date.now().toString();
    const data = JSON.stringify(config.data || {});
    
    // Dalam implementasi nyata, gunakan HMAC-SHA256 atau metode yang lebih aman
    return btoa(`${timestamp}:${data}:${API_CONFIG.apiSecret}`);
  }

  async get<T>(url: string, config = {}): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data: any, config = {}): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data: any, config = {}): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T>(url: string, config = {}): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
// src/shared/services/api/client.ts
import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../../../config/api.config';

// Rate limiting store
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class ApiClient {
  private client: AxiosInstance;
  private rateLimitStore: Map<string, RateLimitEntry> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        // Tambahkan API key ke header jika tersedia
        ...(API_CONFIG.rupApiKey && { 'X-RUP-API-Key': API_CONFIG.rupApiKey }),
      },
    });

    this.setupInterceptors();
    this.startRateLimitCleanup();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Rate limiting check
        if (API_CONFIG.enableRateLimit) {
          const clientId = this.getClientId();
          if (!this.checkRateLimit(clientId)) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
        }

        // Authentication token
        const token = this.getStoredAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Request signing untuk keamanan tambahan
        if (API_CONFIG.rupApiSecret) {
          config.headers['X-Request-Signature'] = this.generateRequestSignature(config);
          config.headers['X-Request-Timestamp'] = Date.now().toString();
        }

        // Client identification
        config.headers['X-Client-Id'] = this.getClientId();
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful requests in development
        if (API_CONFIG.environment === 'development') {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data?.length ? `${response.data.length} items` : 'success'
          });
        }
        return response;
      },
      (error) => {
        // Handle different error types
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        } else if (error.response?.status === 429) {
          // Rate limit exceeded from server
          console.warn('Server rate limit exceeded');
        } else if (error.response?.status >= 500) {
          console.error('Server error:', error.response.status);
        }

        // Log errors in development
        if (API_CONFIG.environment === 'development') {
          console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            message: error.message
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private getClientId(): string {
    // Generate atau ambil client ID yang tersimpan
    let clientId = localStorage.getItem('clientId');
    
    if (!clientId) {
      // Generate client ID berdasarkan browser fingerprint
      clientId = this.generateClientFingerprint();
      localStorage.setItem('clientId', clientId);
    }
    
    return clientId;
  }

  private generateClientFingerprint(): string {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0
    ].join('|');

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }

  private checkRateLimit(clientId: string): boolean {
    if (!API_CONFIG.enableRateLimit) return true;

    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const entry = this.rateLimitStore.get(clientId);

    if (!entry || now > entry.resetTime) {
      // Reset atau buat window baru
      this.rateLimitStore.set(clientId, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (entry.count >= API_CONFIG.maxRequestsPerHour) {
      return false; // Rate limit exceeded
    }

    entry.count++;
    return true;
  }

  private generateRequestSignature(config: AxiosRequestConfig): string {
    if (!API_CONFIG.rupApiSecret) return '';

    const timestamp = Date.now().toString();
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url || '';
    const data = config.data ? JSON.stringify(config.data) : '';
    
    // Simple signature generation (dalam production, gunakan HMAC-SHA256)
    const payload = `${method}:${url}:${data}:${timestamp}`;
    
    // Untuk demo, kita gunakan simple hash. Dalam production, gunakan crypto library
    return btoa(payload + ':' + API_CONFIG.rupApiSecret).slice(0, 32);
  }

  private getStoredAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('authToken');
    // Redirect ke login page atau refresh token
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }

  private startRateLimitCleanup(): void {
    // Cleanup expired rate limit entries setiap 5 menit
    setInterval(() => {
      const now = Date.now();
      for (const [clientId, entry] of this.rateLimitStore.entries()) {
        if (now > entry.resetTime) {
          this.rateLimitStore.delete(clientId);
        }
      }
    }, 5 * 60 * 1000);
  }

  // Public methods
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

  // Utility methods
  getRemainingRequests(clientId?: string): number {
    const id = clientId || this.getClientId();
    const entry = this.rateLimitStore.get(id);
    
    if (!entry || Date.now() > entry.resetTime) {
      return API_CONFIG.maxRequestsPerHour;
    }
    
    return Math.max(0, API_CONFIG.maxRequestsPerHour - entry.count);
  }

  getRateLimitReset(clientId?: string): Date | null {
    const id = clientId || this.getClientId();
    const entry = this.rateLimitStore.get(id);
    
    return entry ? new Date(entry.resetTime) : null;
  }
}

export const apiClient = new ApiClient();
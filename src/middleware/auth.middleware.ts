import { API_CONFIG } from '../config/api.config';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class AuthMiddleware {
  private rateLimitStore: RateLimitStore = {};
  private readonly maxRequests = 100; // 100 requests per hour
  private readonly windowMs = 60 * 60 * 1000; // 1 hour

  validateApiKey(apiKey: string): boolean {
    if (!API_CONFIG.apiKey) {
      console.warn('API Key not configured');
      return false;
    }
    
    return apiKey === API_CONFIG.apiKey;
  }

  checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimitStore[identifier];

    if (!userLimit || now > userLimit.resetTime) {
      // Reset or create new limit window
      this.rateLimitStore[identifier] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return true;
    }

    if (userLimit.count >= this.maxRequests) {
      return false; // Rate limit exceeded
    }

    userLimit.count++;
    return true;
  }

  generateClientId(): string {
    // Generate unique client ID based on browser fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Client fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
    ].join('|');

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  encryptSensitiveData(data: any): string {
    // Implementasi enkripsi sederhana (gunakan library crypto yang lebih aman)
    if (!API_CONFIG.apiSecret) {
      return JSON.stringify(data);
    }
    
    const dataStr = JSON.stringify(data);
    return btoa(dataStr); // Base64 encoding (tidak aman, gunakan AES di production)
  }

  decryptSensitiveData(encryptedData: string): any {
    try {
      const dataStr = atob(encryptedData);
      return JSON.parse(dataStr);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }
}

export const authMiddleware = new AuthMiddleware();

// src/hooks/useSecureApi.ts
import { useState, useEffect } from 'react';
import { apiClient } from '../shared/services/api/client';
import { authMiddleware } from '../middleware/auth.middleware';

export const useSecureApi = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientId, setClientId] = useState<string>('');

  useEffect(() => {
    // Initialize client authentication
    const initAuth = async () => {
      const id = authMiddleware.generateClientId();
      setClientId(id);
      
      // Check if rate limit allows requests
      const canMakeRequest = authMiddleware.checkRateLimit(id);
      setIsAuthenticated(canMakeRequest);
      
      if (!canMakeRequest) {
        console.warn('Rate limit exceeded for this client');
      }
    };

    initAuth();
  }, []);

  const secureRequest = async (
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ) => {
    if (!isAuthenticated) {
      throw new Error('Client not authenticated or rate limited');
    }

    // Check rate limit before each request
    if (!authMiddleware.checkRateLimit(clientId)) {
      setIsAuthenticated(false);
      throw new Error('Rate limit exceeded');
    }

    // Encrypt sensitive data if needed
    const encryptedData = data ? authMiddleware.encryptSensitiveData(data) : data;

    try {
      const response = await apiClient[method](url, encryptedData);
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    clientId,
    secureRequest,
  };
};
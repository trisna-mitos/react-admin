import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      message: axiosError.message || 'Network error occurred',
      status: axiosError.response?.status,
      code: axiosError.code
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message
    };
  }
  
  return {
    message: 'An unknown error occurred'
  };
}

export function isNetworkError(error: ApiError): boolean {
  return error.code === 'NETWORK_ERROR' || error.status === undefined;
}

export function isServerError(error: ApiError): boolean {
  return !!error.status && error.status >= 500;
}

export function isClientError(error: ApiError): boolean {
  return !!error.status && error.status >= 400 && error.status < 500;
}
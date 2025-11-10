// src/lib/errorHandler.ts - Centralized error handling utilities
import { logger } from './logger';

export interface ErrorInfo {
  message: string;
  code?: string;
  statusCode?: number;
  isNetworkError?: boolean;
  isRetryable?: boolean;
}

export function parseError(error: any): ErrorInfo {
  // Network errors
  if (error?.message?.includes('network') || error?.message?.includes('fetch') || error?.code === 'NETWORK_ERROR') {
    return {
      message: 'Network connection error. Please check your internet connection and try again.',
      code: 'NETWORK_ERROR',
      isNetworkError: true,
      isRetryable: true,
    };
  }

  // Timeout errors
  if (error?.message?.includes('timeout') || error?.code === 'TIMEOUT') {
    return {
      message: 'Request timed out. Please try again.',
      code: 'TIMEOUT',
      isRetryable: true,
    };
  }

  // Supabase errors
  if (error?.code) {
    const supabaseErrorMap: Record<string, ErrorInfo> = {
      'PGRST116': {
        message: 'Resource not found.',
        code: 'NOT_FOUND',
        isRetryable: false,
      },
      '23505': {
        message: 'This record already exists.',
        code: 'DUPLICATE',
        isRetryable: false,
      },
      '23503': {
        message: 'Invalid reference. Please check your input.',
        code: 'FOREIGN_KEY',
        isRetryable: false,
      },
      '42501': {
        message: 'Permission denied. You don\'t have access to this resource.',
        code: 'PERMISSION_DENIED',
        isRetryable: false,
      },
    };

    if (supabaseErrorMap[error.code]) {
      return supabaseErrorMap[error.code];
    }
  }

  // Generic error
  return {
    message: error?.message || 'An unexpected error occurred. Please try again or contact support if the issue persists.',
    code: error?.code || 'UNKNOWN_ERROR',
    isRetryable: true,
  };
}

export function isRetryableError(error: any): boolean {
  const errorInfo = parseError(error);
  return errorInfo.isRetryable ?? false;
}

export function isNetworkError(error: any): boolean {
  const errorInfo = parseError(error);
  return errorInfo.isNetworkError ?? false;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if error is not retryable
      if (!isRetryableError(error)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        break;
      }
      
      // Exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export function getErrorMessage(error: any): string {
  const errorInfo = parseError(error);
  return errorInfo.message;
}


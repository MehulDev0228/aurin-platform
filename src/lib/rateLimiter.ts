// src/lib/rateLimiter.ts - Client-side rate limiting utilities

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  check(key: string, options: RateLimitOptions): boolean {
    const now = Date.now();
    const windowStart = now - options.windowMs;
    
    // Get or create request history for this key
    let requestHistory = this.requests.get(key) || [];
    
    // Filter out requests outside the window
    requestHistory = requestHistory.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (requestHistory.length >= options.maxRequests) {
      return false;
    }
    
    // Add current request
    requestHistory.push(now);
    this.requests.set(key, requestHistory);
    
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }

  clear(): void {
    this.requests.clear();
  }
}

export const rateLimiter = new RateLimiter();

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}


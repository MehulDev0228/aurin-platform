// src/lib/logger.ts - Centralized logging utility
// In production, replace with proper logging service (Sentry, LogRocket, etc.)

type LogLevel = 'log' | 'warn' | 'error' | 'info';

interface LogOptions {
  level?: LogLevel;
  context?: string;
  error?: Error;
  data?: any;
  [key: string]: any; // Allow any additional properties
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors
    if (this.isProduction) {
      return level === 'error';
    }
    // In development, log everything
    return true;
  }

  private formatMessage(message: string, options?: LogOptions): string {
    const context = options?.context ? `[${options.context}] ` : '';
    return `${context}${message}`;
  }

  log(message: string, options?: LogOptions): void {
    if (!this.shouldLog('log')) return;
    const formatted = this.formatMessage(message, options);
    // eslint-disable-next-line no-console
    console.log(formatted, options?.data || '');
  }

  info(message: string, options?: LogOptions): void {
    if (!this.shouldLog('info')) return;
    const formatted = this.formatMessage(message, options);
    // eslint-disable-next-line no-console
    console.info(formatted, options?.data || '');
  }

  warn(message: string, options?: LogOptions): void {
    if (!this.shouldLog('warn')) return;
    const formatted = this.formatMessage(message, options);
    // eslint-disable-next-line no-console
    console.warn(formatted, options?.data || '');
  }

  error(message: string, options?: LogOptions): void {
    if (!this.shouldLog('error')) return;
    const formatted = this.formatMessage(message, options);
    const error = options?.error || new Error(message);
    
    // eslint-disable-next-line no-console
    console.error(formatted, error, options?.data || '');
    
    // In production, send to logging service
    if (this.isProduction) {
      // TODO: Integrate with logging service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(error, { extra: options?.data });
    }
  }
}

export const logger = new Logger();


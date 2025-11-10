// src/lib/sanitize.ts - Input sanitization utilities
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 10000); // Max length
}

export function sanitizeEmail(email: string): string {
  return sanitizeString(email).toLowerCase();
}

export function sanitizeUrl(url: string): string {
  const sanitized = sanitizeString(url);
  if (!sanitized) return '';
  // Basic URL validation
  try {
    new URL(sanitized);
    return sanitized;
  } catch {
    return '';
  }
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/javascript:/gi, ''); // Remove javascript: protocol
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}


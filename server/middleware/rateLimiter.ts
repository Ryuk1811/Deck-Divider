import type { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

function createMemoryRateLimiter(options: {
  windowMs: number;
  max: number;
  message: { error: string; [key: string]: any };
}) {
  const hits = new Map<string, RateLimitRecord>();

  // Cleanup expired buckets every 2 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(ip);
      }
    }
  }, 120000).unref?.();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const existing = hits.get(ip);

    if (!existing || now > existing.resetTime) {
      hits.set(ip, {
        count: 1,
        resetTime: now + options.windowMs,
      });
      res.setHeader('RateLimit-Limit', options.max);
      res.setHeader('RateLimit-Remaining', options.max - 1);
      return next();
    }

    if (existing.count >= options.max) {
      res.setHeader('RateLimit-Limit', options.max);
      res.setHeader('RateLimit-Remaining', 0);
      res.setHeader('Retry-After', Math.ceil((existing.resetTime - now) / 1000));
      res.status(429).json(options.message);
      return;
    }

    existing.count += 1;
    res.setHeader('RateLimit-Limit', options.max);
    res.setHeader('RateLimit-Remaining', options.max - existing.count);
    return next();
  };
}

// Strict Rate Limiter for Scraper & Cert Lookup Endpoints
export const certScraperLimiter = createMemoryRateLimiter({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // Max 30 requests per minute per IP
  message: {
    error: 'Rate limit exceeded for cert market lookups. Maximum 30 requests per minute allowed.',
    retryAfterSeconds: 60,
  },
});

// Rate Limiter for Billing Endpoints to prevent brute-force or rapid PayPal API abuse
export const billingLimiter = createMemoryRateLimiter({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // Max 30 requests per minute per IP
  message: {
    error: 'Too many billing requests. Please wait a minute before trying again.',
  },
});

// General API Rate Limiter
export const apiGeneralLimiter = createMemoryRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 600, // Max 600 requests per 15 minutes per IP
  message: {
    error: 'API rate limit exceeded. Please try again later.',
  },
});

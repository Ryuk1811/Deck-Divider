import rateLimit from 'express-rate-limit';

// Strict Rate Limiter for Scraper & Cert Lookup Endpoints
// Protects server IP from eBay & Registrar IP bans or CAPTCHA triggers
export const certScraperLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 15, // Max 15 requests per minute per IP
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  validate: { xForwardedForHeader: false },
  message: {
    error: 'Rate limit exceeded for cert market lookups. Maximum 15 requests per minute allowed.',
    retryAfterSeconds: 60,
  },
});

// Rate Limiter for Billing Endpoints to prevent brute-force or rapid PayPal API abuse
export const billingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 20, // Max 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    error: 'Too many billing requests. Please wait a minute before trying again.',
  },
});

// General API Rate Limiter
export const apiGeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 300, // Max 300 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    error: 'API rate limit exceeded. Please try again later.',
  },
});

import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Limits all API requests to prevent abuse
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication routes
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
});

/**
 * AI content generation rate limiter
 * More restrictive due to API costs
 */
export const aiGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each user to 20 AI generations per hour
  message: {
    success: false,
    error: 'AI generation limit reached. Please try again later.',
    details:
      'Free tier: 20 generations per hour. Upgrade for unlimited access.',
  },
  // Use standard IP-based limiting by default (with IPv6 support)
  // User-specific limiting is handled at application level via Clerk userId
  standardHeaders: true,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'AI generation limit reached. Please try again later.',
      details:
        'Free tier: 20 generations per hour. Upgrade for unlimited access.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

/**
 * Read operations rate limiter
 * Less restrictive for GET requests
 */
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 read requests per windowMs
  message: {
    success: false,
    error: 'Too many read requests, please try again later.',
  },
  standardHeaders: true,
});

/**
 * Delete operations rate limiter
 * Moderate restrictions for destructive operations
 */
export const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 delete requests per windowMs
  message: {
    success: false,
    error: 'Too many delete requests, please try again later.',
  },
  standardHeaders: true,
});

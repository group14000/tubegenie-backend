import rateLimit from 'express-rate-limit';
import { Request } from 'express';

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
    details: 'Free tier: 20 generations per hour. Upgrade for unlimited access.',
  },
  keyGenerator: (req: Request) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    const auth = (req as any).auth;
    const userId = auth?.userId || auth?.sessionClaims?.sub || auth?.subject;
    return userId || req.ip || 'anonymous';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'AI generation limit reached. Please try again later.',
      details: 'Free tier: 20 generations per hour. Upgrade for unlimited access.',
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
  max: 200, // Limit each user to 200 read requests per windowMs
  message: {
    success: false,
    error: 'Too many read requests, please try again later.',
  },
  keyGenerator: (req: Request) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    const auth = (req as any).auth;
    const userId = auth?.userId || auth?.sessionClaims?.sub || auth?.subject;
    return userId || req.ip || 'anonymous';
  },
});

/**
 * Delete operations rate limiter
 * Moderate restrictions for destructive operations
 */
export const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each user to 50 delete requests per windowMs
  message: {
    success: false,
    error: 'Too many delete requests, please try again later.',
  },
  keyGenerator: (req: Request) => {
    const auth = (req as any).auth;
    const userId = auth?.userId || auth?.sessionClaims?.sub || auth?.subject;
    return userId || req.ip || 'anonymous';
  },
});

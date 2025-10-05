import { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@clerk/express';

/**
 * Middleware to require authentication using Clerk
 * Use this on routes that need authentication
 */
export const authMiddleware = requireAuth();

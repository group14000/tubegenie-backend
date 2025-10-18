import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 * Place this at the end of all routes
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.message,
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: 'Invalid ID format',
    });
    return;
  }

  // Handle OpenAI/OpenRouter API errors
  if (err.status || err.code) {
    const status = err.status || 500;
    const errorMessage = err.message || 'AI service error';
    
    // Map common AI API errors to user-friendly messages
    if (err.code === 'insufficient_quota' || err.code === 'rate_limit_exceeded') {
      res.status(429).json({
        success: false,
        error: 'AI service temporarily unavailable',
        message: 'Please try again in a few moments.',
      });
      return;
    }

    if (err.code === 'invalid_api_key' || err.code === 'authentication_error') {
      res.status(500).json({
        success: false,
        error: 'AI service configuration error',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Please contact support.',
      });
      return;
    }

    if (err.code === 'invalid_request_error') {
      res.status(400).json({
        success: false,
        error: 'Invalid request to AI service',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Please check your input and try again.',
      });
      return;
    }

    if (status === 503 || status === 502) {
      res.status(503).json({
        success: false,
        error: 'AI service temporarily unavailable',
        message: 'The AI service is currently unavailable. Please try again later.',
      });
      return;
    }
  }

  // Handle AI content generation errors (from our ai.service.ts)
  if (err.message?.includes('JSON') || err.message?.includes('parse')) {
    res.status(500).json({
      success: false,
      error: 'AI response processing error',
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'The AI model returned an unexpected format. Please try again or select a different model.',
    });
    return;
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred. Please try again.',
  });
};

/**
 * Middleware to handle 404 Not Found
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
};

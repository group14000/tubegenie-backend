import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { swaggerSpec } from './config/swagger.config';
import { connectDB } from './db/connection';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rate-limit.middleware';

const app = express();

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
      scriptSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
      imgSrc: ["'self'", "data:", "https:"], // For Swagger UI
    },
  },
  crossOriginEmbedderPolicy: false, // For Swagger UI
}));

// CORS configuration
app.use(cors({
  origin: [config.frontendUrl, 'https://tubegenie-frontend.vercel.app'], // Allow both local and production frontend
  credentials: true, // Allow cookies to be sent
}));

// Global rate limiting - apply to all requests
app.use(generalLimiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TubeGenie API Documentation',
}));

// Routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`🚀 TubeGenie Backend running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
      console.log(`🌐 Frontend URL allowed: ${config.frontendUrl}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
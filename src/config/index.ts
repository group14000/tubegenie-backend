import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/TubeGenie',
  
  // Clerk
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  
  // OpenRouter AI
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  siteUrl: process.env.SITE_URL || 'http://localhost:5000',
  siteName: process.env.SITE_NAME || 'TubeGenie',
};

// Validate required environment variables
const requiredEnvVars = [
  'CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'OPENROUTER_API_KEY',
  'MONGODB_URI'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set in environment variables`);
  }
}

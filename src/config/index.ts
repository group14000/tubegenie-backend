import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV || '',

  // MongoDB
  mongoUri: process.env.MONGODB_URI || '',

  // Clerk
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,

  // OpenRouter AI
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  siteUrl: process.env.SITE_URL || '',
  siteName: process.env.SITE_NAME || '',
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

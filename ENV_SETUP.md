# Environment Setup Guide

This document explains how to set up environment variables for different deployment scenarios.

## Required Environment Variables

Create the appropriate `.env` file based on your deployment target:

### 1. Local Development (`.env`)

```bash
NODE_ENV=development
PORT=5000

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/TubeGenie
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/TubeGenie

# OpenRouter AI API Key
OPENROUTER_API_KEY=your_openrouter_api_key

# Site Information
SITE_URL=http://localhost:5000
SITE_NAME=TubeGenie

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# API URL
API_URL=http://localhost:5000
```

### 2. Docker Development (`.env.docker`)

```bash
NODE_ENV=production
PORT=5000

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB Atlas (recommended for Docker)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/TubeGenie

# OpenRouter AI API Key
OPENROUTER_API_KEY=your_openrouter_api_key

# Site Information
SITE_URL=http://localhost:5000
SITE_NAME=TubeGenie

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# API URL
API_URL=http://localhost:5000
```

### 3. Production Deployment (`.env.production`)

```bash
NODE_ENV=production
PORT=5000

# Clerk Authentication (use production keys)
CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret

# MongoDB Atlas Production
MONGODB_URI=mongodb+srv://user:password@production-cluster.mongodb.net/TubeGenie

# OpenRouter AI API Key (production)
OPENROUTER_API_KEY=your_production_openrouter_key

# Site Information
SITE_URL=https://api.yourdomain.com
SITE_NAME=TubeGenie

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com

# API URL
API_URL=https://api.yourdomain.com
```

## Getting API Keys

### Clerk Authentication
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable and secret keys from the dashboard
4. For production, use keys starting with `pk_live_` and `sk_live_`

### MongoDB
- **Local**: Install MongoDB locally or use `mongodb://localhost:27017`
- **Production**: Use [MongoDB Atlas](https://mongodb.com/cloud/atlas) (free tier available)

### OpenRouter AI
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Generate an API key from the dashboard
3. Add credits to your account

## Security Notes

⚠️ **NEVER commit `.env` files to git!**

- All `.env*` files are in `.gitignore`
- Keep production credentials secure
- Use different keys for development and production
- Rotate keys regularly
- Use environment secrets in deployment platforms (Vercel, Railway, etc.)

## Deployment Platforms

### Docker
```bash
# Uses .env.docker file
docker-compose up -d
```

### Vercel/Railway/Render
Set environment variables in the platform dashboard - do not use .env files.

### VPS/EC2
Create `.env.production` file on the server with production values.

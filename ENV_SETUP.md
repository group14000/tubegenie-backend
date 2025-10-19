# Environment Setup Guide

This document explains how to set up environment variables for different deployment scenarios.

## Deployment Scenarios

- **Local Development**: Run with `pnpm dev` for hot reload
- **Docker Development**: Run with `pnpm docker:up` for containerized environment
- **Production (Railway)**: Deploy to Railway.com with MongoDB Atlas

## Required Environment Variables

### 1. Local Development (`.env`)

For running locally with `pnpm dev`:

```bash
NODE_ENV=development
PORT=5000

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB Connection
# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/TubeGenie

# Option B: MongoDB Atlas (recommended)
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/TubeGenie

# Option C: Docker MongoDB (if running mongodb container)
# MONGODB_URI=mongodb://admin:changeme@localhost:27017/TubeGenie?authSource=admin

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

### 2. Docker Development (`.env`)

For running with `pnpm docker:up` (API + MongoDB in Docker):

**Important**: Docker Compose uses the same `.env` file. Update it to use Docker MongoDB:

```bash
NODE_ENV=production
PORT=5000

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB Docker Configuration
# Use 'mongodb' as hostname (docker-compose service name)
MONGODB_URI=mongodb://admin:changeme@mongodb:27017/TubeGenie?authSource=admin

# MongoDB Docker Credentials (must match docker-compose.yml)
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=changeme

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

**Note**: 
- Change `MONGODB_URI` hostname from `localhost` to `mongodb` when using Docker
- Change it back to `localhost` or `Atlas` when running locally without Docker

### 3. Railway Production Deployment

For Railway, set environment variables in the Railway dashboard (not in a file):

**Railway Dashboard → Your Service → Variables:**

```bash
NODE_ENV=production
PORT=5000

# Clerk Authentication (use production keys)
CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret

# MongoDB Atlas (required for Railway)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/TubeGenie?retryWrites=true&w=majority

# OpenRouter AI API Key (production)
OPENROUTER_API_KEY=sk-or-v1-your_production_key

# Site Information (use Railway domain)
SITE_URL=https://your-app.railway.app
SITE_NAME=TubeGenie

# Frontend URL (for CORS - use your Vercel/production domain)
FRONTEND_URL=https://tubegenie-frontend.vercel.app

# API URL (use Railway domain)
API_URL=https://your-app.railway.app
```

**Railway Deployment Notes:**
- Do NOT create `.env.production` file - use Railway dashboard
- Railway automatically injects environment variables
- Use MongoDB Atlas (Railway doesn't provide MongoDB)
- Update URLs to use your Railway domain after first deployment
- Set variables BEFORE deploying for the first time

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

# TubeGenie Backend# TubeGenie Backend



A Node.js backend application for generating YouTube content ideas using AI. The application integrates Clerk authentication, MongoDB database, and DeepSeek AI (via OpenRouter) to help users create engaging YouTube content.A Node.js backend application for generating YouTube content ideas using AI. The application integrates Clerk authentication, MongoDB database, and DeepSeek AI (via OpenRouter) to help users create engaging YouTube content.



## Features## Features



- 🤖 AI-powered YouTube content generation (titles, descriptions, tags, thumbnails, script outlines)- 🤖 AI-powered YouTube content generation (titles, descriptions, tags, thumbnails, script outlines)

- 🔐 Secure authentication with Clerk- 🔐 Secure authentication with Clerk

- 💾 MongoDB database for storing generated content- 💾 MongoDB database for storing generated content

- 📝 RESTful API with TypeScript- 📝 RESTful API with TypeScript

- 🎯 User-specific content isolation- 🎯 User-specific content isolation

- 🛡️ Rate limiting to prevent abuse and control AI costs- 🛡️ Rate limiting to prevent abuse and control AI costs

- ⭐ Favorites system for bookmarking content- ⭐ Favorites system for bookmarking content

- 🔍 Full-text search across all content fields- 🔍 Full-text search across all content fields

- 🤖 Multiple AI model selection (DeepSeek, Gemini, GLM)- 🤖 Multiple AI model selection (DeepSeek, Gemini, GLM)

- 📤 Export functionality (PDF, CSV, Plain Text, Markdown)- 📤 Export functionality (PDF, CSV, Plain Text, Markdown)

- 📊 Usage analytics dashboard with insights and stats- 📊 Usage analytics dashboard with insights and stats



## Tech Stack## Tech Stack



- **Runtime**: Node.js- **Runtime**: Node.js

- **Framework**: Express.js- **Framework**: Express.js

- **Language**: TypeScript- **Language**: TypeScript

- **Database**: MongoDB with Mongoose- **Database**: MongoDB with Mongoose

- **Authentication**: Clerk- **Authentication**: Clerk

- **AI**: DeepSeek AI (via OpenRouter)- **AI**: DeepSeek AI (via OpenRouter)

- **Package Manager**: pnpm- **Package Manager**: pnpm



## Prerequisites## Prerequisites



- Node.js (v18 or higher)- Node.js (v18 or higher)

- MongoDB (local installation)- MongoDB (Docker/local or Atlas)

- Clerk account (for authentication)- Clerk account (for authentication)

- OpenRouter API key (for AI integration)- OpenRouter API key (for AI integration)

- Docker Desktop (optional, for containerized development)

## Installation

## Running the Application

1. **Clone the repository:**

```bash### Option 1: Local Development (without Docker)

git clone <repository-url>

cd tubegenie-backendPerfect for development with hot reload.

```

### Option 1: Local Development (without Docker)

2. **Install dependencies:**

```bashPerfect for development with hot reload.

pnpm install

```**1. Clone and install:**

```bash

3. **Set up environment variables:**git clone <repository-url>

cd tubegenie-backend

Create a `.env` file in the root directory with the following variables:pnpm install

```env```

# Server Configuration

PORT=5000**2. Set up environment variables:**

NODE_ENV=development

Create a `.env` file in the root directory:

# Clerk Authentication```env

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key# Port

CLERK_SECRET_KEY=your_clerk_secret_keyPORT=5000

NODE_ENV=development

# MongoDB Connection (Local)

MONGODB_URI=mongodb://localhost:27017/TubeGenie# Clerk API Keys

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# OpenRouter AI API KeyCLERK_SECRET_KEY=your_clerk_secret_key

OPENROUTER_API_KEY=your_openrouter_api_key

# MongoDB Connection String

# Site Information# For MongoDB Atlas (recommended):

SITE_URL=http://localhost:5000MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/TubeGenie

SITE_NAME=TubeGenie# For local MongoDB:

# MONGODB_URI=mongodb://localhost:27017/TubeGenie

# Frontend URL (for CORS)

FRONTEND_URL=http://localhost:3000# OpenRouter AI API Key

OPENROUTER_API_KEY=your_openrouter_api_key

# API URL

API_URL=http://localhost:5000# Site Information (for OpenRouter)

```SITE_URL=http://localhost:5000

SITE_NAME=TubeGenie

4. **Start MongoDB:**

# Frontend URL (for CORS)

Make sure MongoDB is installed and running locally:FRONTEND_URL=http://localhost:3000

```bash

# On Windows (if MongoDB is installed as a service)# API URL

net start MongoDBAPI_URL=http://localhost:5000

```

# Or run MongoDB manually

mongod**3. Start MongoDB (if using local):**

``````bash

mongod

## Development```



Run the development server with hot reload:**4. Run development server:**

```bash```bash

pnpm devpnpm dev

``````



The server will start on `http://localhost:5000`The server will start on `http://localhost:5000`



## Build### Option 2: Docker Development (with MongoDB)



Compile TypeScript to JavaScript:Run the full stack in Docker with isolated environment.

```bash

pnpm build**1. Set up environment:**

```

Your `.env` file should have:

## Production```env

NODE_ENV=production

Run the production build:PORT=5000

```bashCLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

pnpm buildCLERK_SECRET_KEY=your_clerk_secret_key

pnpm start

```# Use 'mongodb' as hostname for Docker network

MONGODB_URI=mongodb://admin:changeme@mongodb:27017/TubeGenie?authSource=admin

## API DocumentationMONGO_ROOT_USER=admin

MONGO_ROOT_PASSWORD=changeme

The application includes **Swagger/OpenAPI documentation** with an interactive testing interface.

OPENROUTER_API_KEY=your_openrouter_api_key

**Access the Swagger UI at**: `http://localhost:5000/api-docs`SITE_URL=http://localhost:5000

SITE_NAME=TubeGenie

Features:FRONTEND_URL=http://localhost:3000

- 📚 Complete API reference for all endpointsAPI_URL=http://localhost:5000

- 🧪 Interactive testing - try API calls directly from your browser```

- 📝 Request/response schemas with examples

- 🔐 Authentication testing with Clerk JWT tokens**2. Start all services (API + MongoDB):**

- 📊 Organized by categories: Content Generation, Management, Analytics, Export, Models, Health```bash

pnpm docker:up

## Getting API Keys```



### Clerk Authentication**3. View logs:**

1. Sign up at [clerk.com](https://clerk.com)```bash

2. Create a new applicationpnpm docker:logs

3. Copy the publishable and secret keys from the dashboard```



### OpenRouter**4. Stop services:**

1. Sign up at [openrouter.ai](https://openrouter.ai)```bash

2. Navigate to API Keys sectionpnpm docker:down

3. Create a new API key```

4. The free tier includes access to DeepSeek AI

**5. Access points:**

## Available Scripts- API: http://localhost:5000

- API Docs: http://localhost:5000/api-docs

```bash- MongoDB: localhost:27017 (admin/changeme)

# Development

pnpm dev            # Run development server with hot reloadSee [DOCKER.md](DOCKER.md) for detailed Docker setup and troubleshooting.



# Build### Option 3: Production Deployment (Railway)

pnpm build          # Compile TypeScript to JavaScript

Deploy to Railway with automatic deployments from GitHub.

# Production

pnpm start          # Run compiled JavaScript**Prerequisites:**

- Railway account (https://railway.com)

# Test- GitHub repository connected

pnpm test           # Run tests (not implemented yet)- MongoDB Atlas database (recommended)

```

**Deployment Steps:**

## Troubleshooting

1. **Create MongoDB Atlas Database:**

### MongoDB Connection Issues   - Go to https://cloud.mongodb.com

   - Create a free cluster

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`   - Get your connection string

   - Add Railway IP to allowlist (or use 0.0.0.0/0 for allow all)

**Solution**:

1. Make sure MongoDB is installed2. **Deploy to Railway:**

2. Start MongoDB service:   - Go to https://railway.com

   ```bash   - Click "New Project"

   # Windows   - Select "Deploy from GitHub repo"

   net start MongoDB   - Select your `tubegenie-backend` repository

      - Railway will auto-detect Node.js and deploy

   # Mac/Linux

   sudo systemctl start mongod3. **Configure Environment Variables:**

   ```   

3. Verify MongoDB is running:   In Railway dashboard → Your Service → Variables, add:

   ```bash   ```

   mongosh   NODE_ENV=production

   ```   PORT=5000

   

### Port Already in Use   CLERK_PUBLISHABLE_KEY=pk_live_your_production_key

   CLERK_SECRET_KEY=sk_live_your_production_secret

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`   

   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/TubeGenie

**Solution**:   

1. Kill the process using port 5000:   OPENROUTER_API_KEY=sk-or-v1-your_production_key

   ```bash   

   # Windows   SITE_URL=https://your-app.railway.app

   netstat -ano | findstr :5000   SITE_NAME=TubeGenie

   taskkill /PID <PID> /F   

      FRONTEND_URL=https://tubegenie-frontend.vercel.app

   # Mac/Linux   API_URL=https://your-app.railway.app

   lsof -ti:5000 | xargs kill -9   ```

   ```

2. Or change the port in `.env` file4. **Configure Build & Start Commands:**

   

### Clerk Authentication Errors   Railway auto-detects from `package.json`:

   - **Build Command**: `pnpm build`

**Error**: `Clerk: Invalid API key`   - **Start Command**: `pnpm start`

   

**Solution**:   If needed, set manually in Settings → Deploy.

1. Verify your Clerk keys in `.env` file

2. Make sure you're using the correct environment keys (test vs production)5. **Domain Setup:**

3. Check that frontend is using matching Clerk publishable key   - Railway provides a default domain: `your-app.railway.app`

   - Optional: Add custom domain in Settings → Networking

## License

6. **Health Check:**

ISC   ```bash

   curl https://your-app.railway.app/api/health

## Author   ```



TubeGenie Team7. **View Logs:**

   - In Railway dashboard → Deployments → View Logs
   - Monitor real-time logs for debugging

**Railway Features:**
- ✅ Automatic deployments on git push
- ✅ Built-in environment variable management
- ✅ Free tier available ($5 credit/month)
- ✅ Auto-scaling and monitoring
- ✅ Zero-downtime deployments
- ✅ Custom domains and SSL

**Important Notes:**
- Use MongoDB Atlas (not local MongoDB) for production
- Set all environment variables before first deployment
- Update `FRONTEND_URL` to match your frontend deployment
- Update Clerk webhook URLs to point to Railway domain
- Monitor usage to stay within Railway free tier limits

**Troubleshooting Railway Deployment:**

If deployment fails:
1. Check build logs in Railway dashboard
2. Verify all environment variables are set
3. Ensure MongoDB Atlas IP allowlist includes Railway
4. Test MongoDB connection string locally first
5. Check that `package.json` has correct start script

**Railway + MongoDB Atlas Setup:**
```bash
# Your MongoDB connection string should look like:
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/TubeGenie

# Make sure to:
# 1. Replace username and password
# 2. Add ?retryWrites=true&w=majority if needed
# 3. Whitelist Railway IPs in MongoDB Atlas Network Access
```

## Build

Compile TypeScript to JavaScript:

The application includes **Swagger/OpenAPI documentation** with an interactive testing interface:

**Access the Swagger UI at**: `http://localhost:5000/api-docs`

Features:
- 📚 Complete API reference for all endpoints
- 🧪 Interactive testing - try API calls directly from your browser
- 📝 Request/response schemas with examples
- 🔐 Authentication testing with Clerk JWT tokens
- 📊 Organized by categories: Content Generation, Management, Analytics, Export, Models, Health

**How to use:**
1. Start the development server (`pnpm dev`)
2. Open `http://localhost:5000/api-docs` in your browser
3. Click on any endpoint to expand it
4. Click "Try it out" to test the endpoint
5. For protected endpoints, click "Authorize" and enter your Clerk JWT token
6. Fill in the request parameters/body
7. Click "Execute" to see the response

**Getting a Clerk JWT Token:**
1. Create a user account through your frontend application
2. Use browser DevTools to inspect the request headers
3. Copy the `Authorization` header value (starts with `Bearer `)
4. In Swagger UI, click "Authorize" and paste the token (without "Bearer ")

## Build

Compile TypeScript to JavaScript:
```bash
pnpm build
```

## Production (Local)

Run the production build locally:
```bash
pnpm build
pnpm start
```

## Interactive API Documentation

The application includes **Swagger/OpenAPI documentation** with an interactive testing interface:

**Access the Swagger UI at**: `http://localhost:5000/api-docs` (local) or `https://your-app.railway.app/api-docs` (production)

### Health Check
```
GET /api/health
```
No authentication required.

### Generate Content
```
POST /api/content/generate
Authorization: Required (Clerk)
Content-Type: application/json
Rate Limit: 20 requests per hour per user

Body:
{
  "topic": "Akash-2 missile system breakdown",
  "model": "tngtech/deepseek-r1t2-chimera:free" // Optional, defaults to DeepSeek
}

Response:
{
  "success": true,
  "data": {
    "titles": ["Akash-2: India's New Missile System Explained 🔥", "..."],
    "description": "Akash-2 is India's advanced surface-to-air missile...",
    "tags": ["Akash2", "IndiaDefense", "MissileSystem"],
    "thumbnailIdeas": ["Akash-2 Missile 🔥 Explained", "..."],
    "scriptOutline": ["Intro", "Specs", "History", "Impact"],
    "aiModel": "tngtech/deepseek-r1t2-chimera:free"
  }
}
```

### Get Available AI Models
```
GET /api/content/models
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response:
{
  "success": true,
  "data": [
    {
      "id": "tngtech/deepseek-r1t2-chimera:free",
      "name": "DeepSeek R1T2 Chimera",
      "provider": "TNG Technology",
      "description": "Advanced reasoning model with superior problem-solving capabilities",
      "capabilities": ["text-generation", "reasoning", "analysis"],
      "isDefault": true
    },
    {
      "id": "google/gemini-2.0-flash-exp:free",
      "name": "Gemini 2.0 Flash",
      "provider": "Google",
      "description": "Fast multimodal model supporting text and image inputs",
      "capabilities": ["text-generation", "image-understanding", "multimodal"],
      "isDefault": false
    },
    {
      "id": "z-ai/glm-4.5-air:free",
      "name": "GLM 4.5 Air",
      "provider": "Z-AI",
      "description": "Lightweight model optimized for speed and efficiency",
      "capabilities": ["text-generation", "fast-response"],
      "isDefault": false
    }
  ],
  "defaultModel": "tngtech/deepseek-r1t2-chimera:free"
}
}
```

### Get Content History
```
GET /api/content/history?limit=10
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response:
{
  "success": true,
  "data": [...]
}
```

### Get Content by ID
```
GET /api/content/:id
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response:
{
  "success": true,
  "data": {...}
}
```

### Search Content
```
GET /api/content/search?q=keyword
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response:
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### Get Favorites
```
GET /api/content/favorites
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response:
{
  "success": true,
  "data": [...],
  "count": 3
}
```

### Toggle Favorite
```
PATCH /api/content/:id/favorite
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response:
{
  "success": true,
  "data": {...},
  "message": "Added to favorites"
}
```

### Delete Content
```
DELETE /api/content/:id
Authorization: Required (Clerk)
Rate Limit: 50 requests per 15 minutes per user

Response:
{
  "success": true,
  "message": "Content deleted successfully"
}
```

### Export as PDF
```
GET /api/content/:id/export/pdf
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response: Binary PDF file download
Filename: tubegenie-{topic}.pdf
```

### Export as CSV (Single Content)
```
GET /api/content/:id/export/csv
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response: CSV file download
Filename: tubegenie-{topic}.csv
```

### Export All Content as CSV
```
GET /api/content/export/csv
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response: CSV file download with all user's content
Filename: tubegenie-all-content.csv
```

### Get Content as Plain Text (for Clipboard)
```
GET /api/content/:id/export/text
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response:
{
  "success": true,
  "data": {
    "text": "=== Formatted plain text content ===",
    "format": "plain-text"
  }
}
```

### Get Content as Markdown
```
GET /api/content/:id/export/markdown
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response:
{
  "success": true,
  "data": {
    "markdown": "# Topic\n\n## Video Title Options\n...",
    "format": "markdown"
  }
}
```

### Get Analytics Dashboard
```
GET /api/content/analytics
Authorization: Required (Clerk)
Rate Limit: 200 requests per 15 minutes per user

Response:
{
  "success": true,
  "data": {
    "totalContent": 42,
    "totalFavorites": 12,
    "contentByModel": [
      {
        "modelId": "tngtech/deepseek-r1t2-chimera:free",
        "modelName": "DeepSeek",
        "count": 30,
        "percentage": 71
      },
      {
        "modelId": "google/gemini-2.0-flash-exp:free",
        "modelName": "Gemini",
        "count": 12,
        "percentage": 29
      }
    ],
    "topTopics": [
      {
        "topic": "ai in healthcare",
        "count": 5,
        "lastGenerated": "2025-10-05T10:30:00Z"
      }
    ],
    "generationTimeline": [
      { "date": "2025-10-01", "count": 3 },
      { "date": "2025-10-02", "count": 5 }
    ],
    "recentActivity": [
      {
        "contentId": "507f1f77bcf86cd799439011",
        "topic": "AI trends 2025",
        "createdAt": "2025-10-05T09:15:00Z",
        "aiModel": "DeepSeek",
        "isFavorite": true
      }
    ],
    "usageStats": {
      "thisWeek": 8,
      "thisMonth": 25,
      "allTime": 42,
      "averagePerWeek": 5.2
    },
    "tagCloud": [
      { "tag": "ai", "count": 15 },
      { "tag": "technology", "count": 12 },
      { "tag": "tutorial", "count": 8 }
    ]
  }
}
```

## Rate Limiting

The API implements rate limiting to protect against abuse and control AI costs:

| Endpoint | Limit | Window | Reason |
|----------|-------|--------|--------|
| **Global** (all endpoints) | 100 requests | 15 minutes | General protection per IP |
| `POST /api/content/generate` | 20 requests | 1 hour | AI generation costs per user |
| `GET /api/content/history` | 200 requests | 15 minutes | Read operations per user |
| `GET /api/content/search` | 200 requests | 15 minutes | Read operations per user |
| `GET /api/content/favorites` | 200 requests | 15 minutes | Read operations per user |
| `GET /api/content/models` | 200 requests | 15 minutes | Read operations per user |
| `GET /api/content/analytics` | 200 requests | 15 minutes | Read operations per user |
| `PATCH /api/content/:id/favorite` | 200 requests | 15 minutes | Read operations per user |
| `GET /api/content/:id` | 200 requests | 15 minutes | Read operations per user |
| `GET /api/content/:id/export/*` | 200 requests | 15 minutes | Read operations per user |
| `GET /api/content/export/csv` | 200 requests | 15 minutes | Read operations per user |
| `DELETE /api/content/:id` | 50 requests | 15 minutes | Delete operations per user |

**Rate Limit Headers:**
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when the limit resets
- `Retry-After`: Seconds to wait before retrying (on 429 error)

**Example Rate Limit Error (429):**
```json
{
  "error": "Too many AI generation requests. Please try again after 45 minutes."
}
```

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── index.ts         # Environment variables and config
│   └── ai.config.ts     # OpenAI/OpenRouter setup
├── db/                  # Database
│   └── connection.ts    # MongoDB connection
├── models/              # Mongoose schemas
│   └── Content.ts       # Content model
├── controllers/         # Request handlers
│   └── content.controller.ts
├── services/            # Business logic
│   ├── ai.service.ts    # AI integration
│   └── content.service.ts
├── routes/              # API routes
│   ├── content.routes.ts
│   └── index.ts
├── middleware/          # Express middleware
│   ├── auth.middleware.ts       # Clerk authentication
│   ├── rate-limit.middleware.ts # Rate limiting
│   └── error.middleware.ts      # Error handling
└── index.ts             # Application entry point
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | No (default: development) |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes |
| `SITE_URL` | Site URL for OpenRouter | No (default: http://localhost:5000) |
| `SITE_NAME` | Site name for OpenRouter | No (default: TubeGenie) |
| `FRONTEND_URL` | Frontend URL for CORS | No (default: http://localhost:3000) |

## Getting API Keys

### Clerk
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable and secret keys from the dashboard

### OpenRouter
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Navigate to API Keys section
3. Create a new API key
4. The free tier includes access to DeepSeek AI

## Quick Reference: Running the Application

### Local Development (Hot Reload)
```bash
# 1. Set up .env with localhost MongoDB
# 2. Run development server
pnpm install
pnpm dev
# Access: http://localhost:5000
```

### Docker Development (Full Stack)
```bash
# 1. Update .env with MONGODB_URI=mongodb://admin:changeme@mongodb:27017/...
# 2. Start Docker containers
pnpm docker:up

# View logs
pnpm docker:logs

# Stop containers
pnpm docker:down

# Access: http://localhost:5000
# MongoDB: localhost:27017
```

### Production (Railway)
```bash
# 1. Create MongoDB Atlas cluster
# 2. Push code to GitHub
# 3. Connect GitHub to Railway
# 4. Set environment variables in Railway dashboard
# 5. Railway auto-deploys on push
# Access: https://your-app.railway.app
```

## Documentation

- **[ENV_SETUP.md](ENV_SETUP.md)** - Detailed environment variable setup for all scenarios
- **[DOCKER.md](DOCKER.md)** - Complete Docker setup, troubleshooting, and best practices
- **[SECURITY.md](SECURITY.md)** - Security audit and best practices
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guides for various platforms

## License

ISC

## Author

TubeGenie Team

# TubeGenie Backend

A Node.js backend application for generating YouTube content ideas using AI. The application integrates Clerk authentication, MongoDB database, and DeepSeek AI (via OpenRouter) to help users create engaging YouTube content.

## Features

- 🤖 AI-powered YouTube content generation (titles, descriptions, tags, thumbnails, script outlines)
- 🔐 Secure authentication with Clerk
- 💾 MongoDB database for storing generated content
- 📝 RESTful API with TypeScript
- 🎯 User-specific content isolation
- 🛡️ Rate limiting to prevent abuse and control AI costs
- ⭐ Favorites system for bookmarking content
- 🔍 Full-text search across all content fields
- 🤖 Multiple AI model selection (DeepSeek, Gemini, GLM)
- 📤 Export functionality (PDF, CSV, Plain Text, Markdown)
- 📊 Usage analytics dashboard with insights and stats

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **AI**: DeepSeek AI (via OpenRouter)
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Clerk account (for authentication)
- OpenRouter API key (for AI integration)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tubegenie-backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Port
PORT=5000
NODE_ENV=development

# Clerk API Keys
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/TubeGenie

# OpenRouter AI API Key
OPENROUTER_API_KEY=your_openrouter_api_key

# Site Information (for OpenRouter)
SITE_URL=http://localhost:5000
SITE_NAME=TubeGenie
```

4. Start MongoDB (if running locally):
```bash
mongod
```

## Development

Run the development server:
```bash
pnpm dev
```

The server will start on `http://localhost:5000`

### Interactive API Documentation

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

## Production

Run the production build:
```bash
pnpm start
```

## API Endpoints

> **💡 Tip**: For the complete interactive API documentation with examples and testing capabilities, visit the **Swagger UI** at `http://localhost:5000/api-docs` when running the server.

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

## License

ISC

## Author

TubeGenie Team

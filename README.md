# TubeGenie Backend

A Node.js backend application for generating YouTube content ideas using AI. The application integrates Clerk authentication, MongoDB database, and DeepSeek AI (via OpenRouter) to help users create engaging YouTube content.

## Features

- 🤖 AI-powered YouTube content generation (titles, descriptions, tags, thumbnails, script outlines)
- 🔐 Secure authentication with Clerk
- 💾 MongoDB database for storing generated content
- 📝 RESTful API with TypeScript
- 🎯 User-specific content isolation

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

Body:
{
  "topic": "Akash-2 missile system breakdown"
}

Response:
{
  "success": true,
  "data": {
    "titles": ["Akash-2: India's New Missile System Explained 🔥", "..."],
    "description": "Akash-2 is India's advanced surface-to-air missile...",
    "tags": ["Akash2", "IndiaDefense", "MissileSystem"],
    "thumbnailIdeas": ["Akash-2 Missile 🔥 Explained", "..."],
    "scriptOutline": ["Intro", "Specs", "History", "Impact"]
  }
}
```

### Get Content History
```
GET /api/content/history?limit=10
Authorization: Required (Clerk)

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

Response:
{
  "success": true,
  "data": {...}
}
```

### Delete Content
```
DELETE /api/content/:id
Authorization: Required (Clerk)

Response:
{
  "success": true,
  "message": "Content deleted successfully"
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
│   ├── auth.middleware.ts
│   └── error.middleware.ts
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

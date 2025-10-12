# TubeGenie Backend - AI Coding Guidelines

## Architecture Overview
- **Framework**: Node.js with Express.js for REST API server
- **Language**: TypeScript (ES2020 target, CommonJS modules)
- **Package Manager**: pnpm (use `pnpm add` for dependencies, `pnpm add -D` for dev tools)
- **Authentication**: Clerk for user authentication (middleware applied globally)
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: DeepSeek AI via OpenRouter (free tier) for content generation
- **Rate Limiting**: express-rate-limit for API protection and cost control
- **Documentation**: Swagger/OpenAPI 3.0 with interactive UI at `/api-docs`
- **Environment**: dotenv for configuration (PORT, API keys, DB URI)
- **Structure**: Layered architecture - routes → controllers → services → models

## Project Structure
```
src/
├── config/          # Configuration files (env vars, AI setup, Swagger spec)
│   ├── index.ts           # Central config with env validation
│   ├── ai.config.ts       # OpenAI client + 3 AI models (DeepSeek, Gemini, GLM)
│   └── swagger.config.ts  # OpenAPI 3.0 spec with schemas, security, tags
├── db/              # Database connection
├── models/          # Mongoose schemas (Content with isFavorite, timestamps)
├── controllers/     # Request handlers (content.controller.ts)
├── services/        # Business logic
│   ├── ai.service.ts        # AI content generation with structured prompts
│   ├── content.service.ts   # CRUD operations with userId filtering
│   ├── analytics.service.ts # 7 analytics methods (timeline, top topics, tag cloud)
│   └── export.service.ts    # PDF, CSV, Plain Text, Markdown generators
├── routes/          # Route definitions with @swagger JSDoc comments
│   ├── content.routes.ts    # All content endpoints (16+ routes)
│   └── index.ts             # Main router + health check
├── middleware/      # Auth, error handling, and rate limiting
│   ├── auth.middleware.ts   # Clerk authentication wrapper
│   ├── rate-limit.middleware.ts  # 5 limiters (general, AI, read, delete, auth)
│   └── error.middleware.ts  # Global error and 404 handlers
└── index.ts         # Express app setup and server start
```

## Key Workflows
- **Development**: `pnpm dev` (runs TypeScript directly with ts-node)
- **Build**: `pnpm build` (compiles TS to JS in dist/)
- **Production**: `pnpm start` (runs compiled JS from dist/index.js)
- **Install deps**: Always use `pnpm add` instead of npm/yarn

## Code Patterns
- **Imports**: Use ES6 imports (e.g., `import express from 'express'`)
- **Server Setup**: Enable CORS → apply global rate limiter → load config → connect DB → apply middleware → mount Swagger UI → mount routes → add error handlers
- **CORS**: Configured to allow frontend origin from env var `FRONTEND_URL` (default: http://localhost:3000) with credentials
- **Rate Limiting**: Apply `generalLimiter` globally; use specific limiters (aiGenerationLimiter, readLimiter, deleteLimiter) per endpoint. All limiters use IP-based tracking with IPv6 support
- **Routes**: Defined in `routes/` folder, mounted under `/api` prefix
- **Swagger Documentation**: All routes have `@swagger` JSDoc comments with OpenAPI 3.0 annotations (summary, description, tags, security, parameters, requestBody, responses)
- **Controllers**: Handle requests, validate input, call services, return responses
- **Services**: Contain business logic, interact with models and external APIs
- **Models**: Mongoose schemas with TypeScript interfaces; indexed fields: `userId`, `isFavorite`
- **Authentication**: Use `authMiddleware` from `@clerk/express` on protected routes; access user via helper function `getUserId(req)` with `(req as any).auth?.()` function call
- **Error Handling**: Throw errors in services/controllers; caught by global error middleware
- **Development Test Route**: `POST /api/content/generate/test` available only when `NODE_ENV=development` (mocks userId as 'test-user-123')

## API Endpoints
- `POST /api/content/generate` - Generate YouTube content (auth required, rate limited: 20/hour per user)
  - Request: `{ "topic": "your topic here", "model": "optional-model-id" }`
  - Response: `{ titles, description, tags, thumbnailIdeas, scriptOutline, aiModel }`
- `GET /api/content/analytics` - Get usage analytics dashboard (auth required, rate limited: 200/15min per user)
- `GET /api/content/models` - Get available AI models (auth required, rate limited: 200/15min per user)
- `GET /api/content/history?limit=10` - Get user's content history (auth required, rate limited: 200/15min per user)
- `GET /api/content/search?q=keyword` - Search content by keyword (auth required, rate limited: 200/15min per user)
- `GET /api/content/favorites` - Get favorite content (auth required, rate limited: 200/15min per user)
- `PATCH /api/content/:id/favorite` - Toggle favorite status (auth required, rate limited: 200/15min per user)
- `GET /api/content/:id` - Get specific content by ID (auth required, rate limited: 200/15min per user)
- `DELETE /api/content/:id` - Delete content (auth required, rate limited: 50/15min per user)
- `GET /api/content/:id/export/pdf` - Export content as PDF (auth required, rate limited: 200/15min per user)
- `GET /api/content/:id/export/csv` - Export single content as CSV (auth required, rate limited: 200/15min per user)
- `GET /api/content/export/csv` - Export all content as CSV (auth required, rate limited: 200/15min per user)
- `GET /api/content/:id/export/text` - Get plain text for clipboard (auth required, rate limited: 200/15min per user)
- `GET /api/content/:id/export/markdown` - Get markdown format (auth required, rate limited: 200/15min per user)
- `GET /api/health` - Health check (no auth, rate limited: 100/15min per IP)

## Rate Limiting Strategy
- **Global Limiter**: 100 requests per 15 minutes per IP (applies to all endpoints)
- **AI Generation**: 20 requests per hour per IP (most restrictive - protects AI costs)
- **Read Operations**: 200 requests per 15 minutes per IP (GET history, GET by ID)
- **Delete Operations**: 50 requests per 15 minutes per IP
- **Authentication**: 5 attempts per 15 minutes per IP (if auth endpoints added)
- **IP Handling**: Uses built-in IPv6 support from express-rate-limit
- **Headers**: Returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After` on limit exceeded

## AI Integration Pattern
- OpenAI SDK configured with OpenRouter base URL in `config/ai.config.ts`
- AI prompts in `services/ai.service.ts` use structured JSON responses
- Multiple AI models available: DeepSeek R1T2 Chimera (default), Gemini 2.0 Flash, GLM 4.5 Air
- Model selection supported in content generation endpoint
- All models accessed via OpenRouter free tier

## Environment Variables
Required in `.env`:
- `PORT`, `NODE_ENV`
- `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `MONGODB_URI`
- `OPENROUTER_API_KEY`
- `SITE_URL`, `SITE_NAME`
- `FRONTEND_URL` (for CORS, default: http://localhost:3000)

Note: Config validation in `src/config/index.ts` logs warnings (not errors) for missing required vars

## TypeScript Configuration
- **Strict Mode**: Enabled - all code must pass strict type checking
- **Target**: ES2020 (modern JS features available)
- **Modules**: CommonJS (require/module.exports)
- **Types**: Use `types/globals.d.ts` for global type references (Clerk env types)

## Development Conventions
- **Separation of Concerns**: Keep routes, controllers, services, and models separate
- **Async/Await**: Use async/await for all async operations
- **Error Handling**: Always use try-catch in controllers, pass errors to next()
- **Validation**: Validate request bodies in controllers before processing
- **Database Queries**: Use Mongoose models; filter by userId for multi-tenant isolation
- **Testing**: No test framework configured yet - placeholder script exists
- **Linting/Formatting**: Not configured - follow standard TS/JS practices
- **PDF Export Types**: Use `type PDFDoc = typeof PDFDocument.prototype` pattern to avoid type/value confusion
- **MongoDB ObjectId**: Cast `_id` to `any` before `.toString()` to handle unknown types: `(item._id as any).toString()`

## Key Files
- `src/config/index.ts`: Central config with env validation (warnings only, not errors)
- `src/config/ai.config.ts`: OpenAI client setup for OpenRouter with 3 models (AVAILABLE_MODELS array)
- `src/config/swagger.config.ts`: Complete OpenAPI 3.0 spec with 5 schemas, 4 error responses, 6 tags
- `src/db/connection.ts`: MongoDB connection with error handling
- `src/models/Content.ts`: Content schema (userId, topic, generated fields, timestamps, isFavorite indexed)
- `src/services/ai.service.ts`: DeepSeek AI integration for content generation with structured prompts
- `src/services/content.service.ts`: Business logic for content CRUD with userId filtering
- `src/services/analytics.service.ts`: 7 analytics methods (by model, timeline, top topics, recent, usage stats, tag cloud)
- `src/services/export.service.ts`: PDF (pdfkit), CSV (csv-stringify), Plain Text, Markdown generators
- `src/controllers/content.controller.ts`: HTTP request handlers with `getUserId()` helper
- `src/routes/content.routes.ts`: All routes with @swagger JSDoc comments (16+ endpoints)
- `src/routes/index.ts`: Main router mounting content routes + health check
- `src/middleware/auth.middleware.ts`: Clerk authentication wrapper
- `src/middleware/rate-limit.middleware.ts`: 5 rate limiters with IP-based tracking (IPv6 support built-in)
- `src/middleware/error.middleware.ts`: Global error and 404 handlers
- `src/index.ts`: Express app initialization with CORS → rate limiter → Swagger UI → routes → error handlers
- `types/globals.d.ts`: Global type declarations (Clerk auth extension for Express Request)
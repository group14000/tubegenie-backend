# TubeGenie Backend - AI Coding Guidelines

## Architecture Overview
- **Framework**: Node.js with Express.js for REST API server
- **Language**: TypeScript (ES2020 target, CommonJS modules)
- **Package Manager**: pnpm (use `pnpm add` for dependencies, `pnpm add -D` for dev tools)
- **Authentication**: Clerk for user authentication (middleware applied globally)
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: DeepSeek AI via OpenRouter (free tier) for content generation
- **Environment**: dotenv for configuration (PORT, API keys, DB URI)
- **Structure**: Layered architecture - routes → controllers → services → models

## Project Structure
```
src/
├── config/          # Configuration files (env vars, AI setup)
├── db/              # Database connection
├── models/          # Mongoose schemas (Content)
├── controllers/     # Request handlers (content.controller.ts)
├── services/        # Business logic (ai.service.ts, content.service.ts)
├── routes/          # Route definitions (content.routes.ts, index.ts)
├── middleware/      # Auth and error handling
└── index.ts         # Express app setup and server start
```

## Key Workflows
- **Development**: `pnpm dev` (runs TypeScript directly with ts-node)
- **Build**: `pnpm build` (compiles TS to JS in dist/)
- **Production**: `pnpm start` (runs compiled JS from dist/index.js)
- **Install deps**: Always use `pnpm add` instead of npm/yarn

## Code Patterns
- **Imports**: Use ES6 imports (e.g., `import express from 'express'`)
- **Server Setup**: Load config → connect DB → apply middleware → mount routes → add error handlers
- **Routes**: Defined in `routes/` folder, mounted under `/api` prefix
- **Controllers**: Handle requests, validate input, call services, return responses
- **Services**: Contain business logic, interact with models and external APIs
- **Models**: Mongoose schemas with TypeScript interfaces
- **Authentication**: Use `authMiddleware` from `@clerk/express` on protected routes; access user via helper function `getUserId(req)`
- **Error Handling**: Throw errors in services/controllers; caught by global error middleware

## API Endpoints
- `POST /api/content/generate` - Generate YouTube content (auth required)
  - Request: `{ "topic": "your topic here" }`
  - Response: `{ titles, description, tags, thumbnailIdeas, scriptOutline }`
- `GET /api/content/history?limit=10` - Get user's content history (auth required)
- `GET /api/content/:id` - Get specific content by ID (auth required)
- `DELETE /api/content/:id` - Delete content (auth required)
- `GET /api/health` - Health check (no auth)

## AI Integration Pattern
- OpenAI SDK configured with OpenRouter base URL in `config/ai.config.ts`
- AI prompts in `services/ai.service.ts` use structured JSON responses
- Model: `deepseek/deepseek-chat-v3.1:free`
- Parse AI responses to extract JSON, validate structure before returning

## Environment Variables
Required in `.env`:
- `PORT`, `NODE_ENV`
- `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `MONGODB_URI`
- `OPENROUTER_API_KEY`
- `SITE_URL`, `SITE_NAME`

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

## Key Files
- `src/config/index.ts`: Central config with env validation
- `src/config/ai.config.ts`: OpenAI client setup for OpenRouter
- `src/db/connection.ts`: MongoDB connection with error handling
- `src/models/Content.ts`: Content schema (userId, topic, generated fields, timestamps)
- `src/services/ai.service.ts`: DeepSeek AI integration for content generation
- `src/services/content.service.ts`: Business logic for content CRUD
- `src/controllers/content.controller.ts`: HTTP request handlers
- `src/routes/index.ts`: Main router mounting all sub-routes
- `src/middleware/error.middleware.ts`: Global error and 404 handlers
- `src/index.ts`: Express app initialization and server start
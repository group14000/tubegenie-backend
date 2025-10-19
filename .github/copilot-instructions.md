# TubeGenie Backend - AI Coding Guidelines

## Architecture
- **Framework**: Node.js/Express.js REST API with TypeScript (ES2020, CommonJS)
- **Structure**: Layered architecture - routes → controllers → services → models (see `src/index.ts` for setup order)
- **Authentication**: Clerk middleware applied globally; extract userId with `getUserId(req)` using `(req as any).auth?.()` (see `src/controllers/content.controller.ts`)
- **Database**: MongoDB/Mongoose with userId filtering for multi-tenancy (see `src/services/content.service.ts`)
- **AI**: OpenRouter SDK for content generation; models in `src/config/ai.config.ts`
- **Rate Limiting**: IP-based with express-rate-limit; apply `generalLimiter` globally, specific limiters per endpoint (see `src/middleware/rate-limit.middleware.ts`)
- **Security**: Helmet.js for HTTP headers; all secrets in environment variables; CORS restricted to `FRONTEND_URL`

## Workflows
- **Development**: `pnpm dev` (ts-node direct run with hot reload)
- **Build**: `pnpm build` (TS to JS in dist/)
- **Production**: `pnpm start` (compiled JS)
- **API Docs**: Swagger UI at `/api-docs` (interactive testing)
- **Install Deps**: `pnpm add` (not npm/yarn)
- **MongoDB**: Local MongoDB on port 27017

## Patterns
- **Imports**: ES6 style (e.g., `import express from 'express'`)
- **Error Handling**: Throw errors in controllers/services; caught by global middleware (see `src/middleware/error.middleware.ts`)
- **Validation**: Input validation in controllers before service calls
- **DB Queries**: Always filter by `userId` for isolation; cast ObjectId with `(item._id as any).toString()`
- **CORS**: Configured for `FRONTEND_URL` env var (default: http://localhost:3000) with credentials
- **Routes**: @swagger JSDoc comments for OpenAPI docs (see `src/routes/content.routes.ts`)
- **Config**: All secrets and URLs in `config` object from env vars (see `src/config/index.ts`)

## Integration Points
- **Clerk Auth**: Middleware in `src/middleware/auth.middleware.ts`; userId extraction pattern
- **MongoDB**: Connection in `src/db/connection.ts`; schemas in `src/models/`
- **OpenRouter AI**: Client in `src/config/ai.config.ts`; prompts in `src/services/ai.service.ts`
- **Env Config**: Validation in `src/config/index.ts` (warnings only for missing vars)
- **Security Headers**: Helmet middleware in `src/index.ts` with CSP configured for Swagger UI
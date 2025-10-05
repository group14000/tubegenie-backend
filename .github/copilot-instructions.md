# TubeGenie Backend - AI Coding Guidelines

## Architecture Overview
- **Framework**: Node.js with Express.js for REST API server
- **Language**: TypeScript (ES2020 target, CommonJS modules)
- **Package Manager**: pnpm (use `pnpm add` for dependencies, `pnpm add -D` for dev tools)
- **Authentication**: Clerk for user authentication (middleware applied globally)
- **Database**: MongoDB with Mongoose ODM
- **Environment**: dotenv for configuration (PORT, API keys, DB URI)
- **Structure**: Source code in `src/`, compiled JavaScript in `dist/`, types in `types/`
- **Entry Point**: `src/index.ts` (single-file server setup with middleware)

## Key Workflows
- **Development**: `pnpm dev` (runs TypeScript directly with ts-node)
- **Build**: `pnpm build` (compiles TS to JS in dist/)
- **Production**: `pnpm start` (runs compiled JS from dist/index.js)
- **Install deps**: Always use `pnpm add` instead of npm/yarn

## Code Patterns
- **Imports**: Use ES6 imports (e.g., `import express from 'express'`, `import { clerkMiddleware } from '@clerk/express'`)
- **Server Setup**: Load dotenv first, apply clerkMiddleware globally, then define routes
- **Routes**: Define HTTP methods directly on app (e.g., `app.get('/', handler)`)
- **Port**: Read from `process.env.PORT` (default 5000 in .env)
- **Database**: Use Mongoose models for MongoDB interactions (not yet implemented)
- **Authentication**: Clerk handles user sessions via middleware - access user data in routes

## TypeScript Configuration
- **Strict Mode**: Enabled - all code must pass strict type checking
- **Target**: ES2020 (modern JS features available)
- **Modules**: CommonJS (require/module.exports)
- **Types**: Install `@types/*` packages; use `types/globals.d.ts` for global type references (e.g., Clerk env types)

## Development Conventions
- **File Organization**: Keep server logic in `src/`, types in `types/`, add subdirs as needed for routes/middleware/models
- **Environment Variables**: Store in `.env` file (PORT, Clerk keys, MongoDB URI) - never commit secrets
- **Error Handling**: Use Express middleware for errors (not yet implemented)
- **Testing**: No test framework configured yet - placeholder script exists
- **Linting/Formatting**: Not configured - follow standard TS/JS practices

## Key Files
- `package.json`: Scripts and dependencies (includes Clerk, Mongoose, dotenv)
- `tsconfig.json`: TypeScript compiler options
- `src/index.ts`: Main server file (loads dotenv, applies Clerk middleware, basic GET route)
- `.env`: Environment variables (PORT=5000, Clerk test keys, MongoDB URI)
- `types/globals.d.ts`: Global type declarations (Clerk env types)
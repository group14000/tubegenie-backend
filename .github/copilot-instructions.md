# TubeGenie Backend - AI Coding Guidelines

## Architecture Overview
- **Framework**: Node.js with Express.js for REST API server
- **Language**: TypeScript (ES2020 target, CommonJS modules)
- **Package Manager**: pnpm (use `pnpm add` for dependencies, `pnpm add -D` for dev tools)
- **Structure**: Source code in `src/`, compiled JavaScript in `dist/`
- **Entry Point**: `src/index.ts` (single-file server setup)

## Key Workflows
- **Development**: `pnpm dev` (runs TypeScript directly with ts-node)
- **Build**: `pnpm build` (compiles TS to JS in dist/)
- **Production**: `pnpm start` (runs compiled JS from dist/index.js)
- **Install deps**: Always use `pnpm add` instead of npm/yarn

## Code Patterns
- **Imports**: Use ES6 imports (e.g., `import express from 'express'`)
- **Server Setup**: Standard Express app pattern - create app, define routes, listen on port
- **Routes**: Define HTTP methods directly on app (e.g., `app.get('/', handler)`)
- **Port**: Default to 3000 for local development

## TypeScript Configuration
- **Strict Mode**: Enabled - all code must pass strict type checking
- **Target**: ES2020 (modern JS features available)
- **Modules**: CommonJS (require/module.exports)
- **Types**: Install `@types/*` packages for external libs (e.g., `@types/express`)

## Development Conventions
- **File Organization**: Keep server logic in `src/`, add subdirs as needed for routes/middleware
- **Error Handling**: Use Express middleware for errors (not yet implemented)
- **Testing**: No test framework configured yet - placeholder script exists
- **Linting/Formatting**: Not configured - follow standard TS/JS practices

## Key Files
- `package.json`: Scripts and dependencies
- `tsconfig.json`: TypeScript compiler options
- `src/index.ts`: Main server file (example: basic GET route returning text)
# Docker Setup Guide

## Overview

The TubeGenie backend supports multiple deployment options:
- **Local Development**: Run directly with Node.js and hot reload
- **Docker Development**: Full stack in containers (API + MongoDB)
- **Production (Railway)**: Managed platform deployment with MongoDB Atlas

This guide covers Docker-based development. For Railway deployment, see [README.md](README.md#option-3-production-deployment-railway).

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git repository cloned

### 1. Environment Setup

Create your environment file:
```bash
# Copy the template (don't commit this file)
cp ENV_SETUP.md .env.docker  # Fill in your actual values
```

**Required variables in `.env.docker`:**
```bash
NODE_ENV=production
PORT=5000

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx

# MongoDB Docker Configuration (uses docker mongodb service)
MONGODB_URI=mongodb://admin:changeme@mongodb:27017/TubeGenie?authSource=admin
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=changeme

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-xxx

# Site Configuration
SITE_URL=http://localhost:5000
SITE_NAME=TubeGenie
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000
```

### 2. Run the Application

#### Start All Services (API + MongoDB)
```bash
pnpm docker:up
```
This starts both the TubeGenie API and MongoDB containers together.

**What happens:**
- MongoDB container starts on port 27017
- API container connects to MongoDB automatically
- Persistent data stored in Docker volumes
- Both services networked together

#### Alternative Commands
```bash
# Build image only
pnpm docker:build

# View logs (both services)
pnpm docker:logs

# View API logs only
docker logs tubegenie-backend

# View MongoDB logs only
docker logs tubegenie-mongodb

# Stop all services
pnpm docker:down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### 3. Verify Deployment

**Check container status:**
```bash
docker ps
```
You should see both `tubegenie-backend` and `tubegenie-mongodb` containers running.

**Test endpoints:**
- Health: http://localhost:5000/api/health
- API Docs: http://localhost:5000/api-docs
- Generate content: POST http://localhost:5000/api/content/generate

**Access MongoDB (optional):**
```bash
# Connect to MongoDB shell
docker exec -it tubegenie-mongodb mongosh -u admin -p changeme

# Or use MongoDB Compass with:
# mongodb://admin:changeme@localhost:27017/?authSource=admin
```

**View logs:**
```bash
# Both services
pnpm docker:logs

# Individual services
docker logs tubegenie-backend
docker logs tubegenie-mongodb
```

## 📋 Docker Architecture

### Files Overview

- **`Dockerfile`**: Multi-stage build (241MB optimized image)
  - Builder stage: Full Node.js environment with all dependencies
  - Production stage: Alpine Linux with only runtime dependencies
  - Security: Non-root user, minimal attack surface

- **`docker-compose.yml`**: Full stack orchestration
  - **API service**: TubeGenie backend on port 5000
  - **MongoDB service**: MongoDB 7 on port 27017
  - **Persistent volumes**: Data persists across container restarts
  - **Health checks**: Automatic health monitoring
  - **Networking**: Services communicate via `tubegenie-network`

- **`.dockerignore`**: Excludes unnecessary files from build context
  - Node modules, logs, documentation
  - Development files, Git history

### Services Architecture

```
┌─────────────────────────────────────────┐
│         Docker Environment              │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────┐                  │
│  │  TubeGenie API   │                  │
│  │   Port: 5000     │                  │
│  └────────┬─────────┘                  │
│           │                             │
│           │ mongodb://mongodb:27017     │
│           ↓                             │
│  ┌──────────────────┐                  │
│  │   MongoDB 7      │                  │
│  │   Port: 27017    │                  │
│  │   Volume: Data   │                  │
│  └──────────────────┘                  │
│                                         │
└─────────────────────────────────────────┘
```

### Image Details

- **API Image**: `tubegenie-backend:latest` (241MB)
  - Base: `node:18-alpine`
  - Build Stages: 2 (builder + production)
  - Security: Non-root user, minimal packages

- **MongoDB Image**: `mongo:7` (834MB)
  - Official MongoDB image
  - Persistent data volumes
  - Authentication enabled

### Data Persistence

MongoDB data is stored in Docker volumes:
- `mongodb_data`: Database files
- `mongodb_config`: Configuration files

Data persists even when containers are stopped. To completely reset:
```bash
docker-compose down -v  # WARNING: Deletes all data
```

## 🔧 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Change port in docker-compose.yml or .env.docker
PORT=5001
```

**Environment variables missing:**
```bash
# Check logs for missing variables
pnpm docker:logs
```

**MongoDB connection issues:**
```bash
# Check if MongoDB container is running
docker ps | grep mongodb

# View MongoDB logs
docker logs tubegenie-mongodb

# Verify connection string in .env.docker
# Should be: mongodb://admin:changeme@mongodb:27017/TubeGenie?authSource=admin

# Test MongoDB connection
docker exec -it tubegenie-mongodb mongosh -u admin -p changeme --eval "db.adminCommand('ping')"
```

**Build failures:**
```bash
# Clear build cache
docker system prune -f
pnpm docker:build
```

### Clean Restart
```bash
pnpm docker:down
docker system prune -f
pnpm docker:up
```

## 📊 Monitoring & Logs

### Container Logs
```bash
# All services
pnpm docker:logs

# Specific service
docker logs tubegenie-backend-api-1

# Follow logs
docker logs -f tubegenie-backend-api-1
```

### Health Checks
```bash
# Check container health
docker ps

# Test API health
curl http://localhost:5000/api/health
```

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## 🚀 Deployment Options

### Local Development with Docker
```bash
pnpm docker:up
```
**Features:**
- Full stack in Docker (API + MongoDB)
- Persistent data storage
- Isolated environment
- Easy cleanup and reset

### Managing Data

**Backup MongoDB data:**
```bash
# Export database
docker exec tubegenie-mongodb mongodump -u admin -p changeme --authenticationDatabase admin --out /data/backup

# Copy backup to host
docker cp tubegenie-mongodb:/data/backup ./mongodb-backup
```

**Restore MongoDB data:**
```bash
# Copy backup to container
docker cp ./mongodb-backup tubegenie-mongodb:/data/backup

# Restore database
docker exec tubegenie-mongodb mongorestore -u admin -p changeme --authenticationDatabase admin /data/backup
```

**Reset all data (clean slate):**
```bash
docker-compose down -v  # WARNING: Deletes all data
pnpm docker:up
```

### Manual Docker Commands
```bash
# Build only
docker build -t tubegenie-backend .

# Run full stack
docker-compose up -d

# Stop services
docker-compose down

# View all containers
docker ps -a

# Remove everything and start fresh
docker-compose down -v
docker system prune -f
pnpm docker:up
```

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env*` files
- **Secrets**: Use Docker secrets or external secret management
- **Network**: Restrict container networking as needed
- **Updates**: Regularly update base images for security patches
- **User**: Runs as non-root user in container

## 📚 Additional Resources

- **Security Guide**: See `SECURITY.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **API Documentation**: http://localhost:5000/api-docs (when running)
- **Environment Setup**: See `ENV_SETUP.md`

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review container logs: `pnpm docker:logs`
3. Verify environment variables are set correctly
4. Ensure Docker Desktop is running
5. Check network connectivity to MongoDB

---

**Last Updated**: October 19, 2025</content>
<filePath">c:\Users\hp\OneDrive\Documents\github\TubeGenie\tubegenie-backend\DOCKER.md
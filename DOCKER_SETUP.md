# 🐳 Docker Setup Guide for HireFlow

This guide will help you set up and run HireFlow using Docker containers.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 4GB of available RAM
- Ports 80, 3000, 5432, 6379, and 8000 available

## 🚀 Quick Start

### 1. Production Setup

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 2. Development Setup

```bash
# Build and start development services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

## 🏗️ Building Images

### Build All Images

```bash
# Production images
docker-compose build

# Development images
docker-compose -f docker-compose.dev.yml build
```

### Build Specific Service

```bash
# Backend only
docker-compose build backend

# Frontend only
docker-compose build frontend
```

## 🌐 Access Points

### Production
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432
- **Redis**: localhost:6379

### Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Security
SECRET_KEY=your_secret_key_here

# Database (optional - Docker Compose will override)
DATABASE_URL=postgresql://hireflow_user:hireflow_password@postgres:5432/hireflow

# Redis (optional - Docker Compose will override)
REDIS_URL=redis://redis:6379
```

### Database Initialization

The PostgreSQL container will automatically create the database and user. If you need custom initialization, create a `backend/init.sql` file.

## 📊 Service Management

### View Running Services

```bash
docker-compose ps
```

### View Service Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Scale Services

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3
```

## 🧹 Cleanup

### Remove Containers and Networks

```bash
docker-compose down
```

### Remove Everything (Including Volumes)

```bash
docker-compose down -v
```

### Remove Images

```bash
docker-compose down --rmi all
```

### Complete Cleanup

```bash
# Stop and remove everything
docker-compose down -v --rmi all

# Remove unused Docker resources
docker system prune -a --volumes
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :8000

# Kill the process
kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check database container status
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Connect to database directly
docker-compose exec postgres psql -U hireflow_user -d hireflow
```

#### 3. Frontend Build Issues
```bash
# Clear node_modules and rebuild
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install
```

#### 4. Backend Import Issues
```bash
# Check Python path
docker-compose exec backend python -c "import sys; print(sys.path)"

# Verify app structure
docker-compose exec backend ls -la /app
```

### Health Checks

All services include health checks. View health status:

```bash
docker-compose ps
```

### Resource Usage

Monitor resource usage:

```bash
docker stats
```

## 🚀 Production Deployment

### Using Production Compose

```bash
# Start with production profile
docker-compose --profile production up -d
```

### Environment Variables for Production

```bash
# Set production environment
export ENVIRONMENT=production
export DEBUG=false

# Start services
docker-compose up -d
```

### SSL/HTTPS Setup

1. Place SSL certificates in `./ssl/` directory
2. Use the production nginx configuration
3. Start with production profile

```bash
docker-compose --profile production up -d
```

## 📝 Development Workflow

### 1. Start Development Environment

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Make Code Changes

Your local files are mounted as volumes, so changes are reflected immediately.

### 3. View Logs

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### 4. Restart Services (if needed)

```bash
docker-compose -f docker-compose.dev.yml restart backend
```

## 🔐 Security Considerations

### Production Security

- Change default database passwords
- Use strong SECRET_KEY
- Enable SSL/TLS
- Configure firewall rules
- Regular security updates

### Development Security

- Use development database
- Enable DEBUG mode only in development
- Don't expose production credentials

## 📚 Additional Commands

### Database Operations

```bash
# Create database backup
docker-compose exec postgres pg_dump -U hireflow_user hireflow > backup.sql

# Restore database
docker-compose exec -T postgres psql -U hireflow_user hireflow < backup.sql
```

### Redis Operations

```bash
# Connect to Redis CLI
docker-compose exec redis redis-cli

# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL
```

### Container Shell Access

```bash
# Access backend container
docker-compose exec backend bash

# Access frontend container
docker-compose exec frontend sh

# Access database container
docker-compose exec postgres bash
```

## 🆘 Getting Help

If you encounter issues:

1. Check service logs: `docker-compose logs -f <service>`
2. Verify container status: `docker-compose ps`
3. Check resource usage: `docker stats`
4. Ensure ports are available: `lsof -i :<port>`

## 📖 Next Steps

After successful Docker setup:

1. Test the API endpoints
2. Verify frontend-backend communication
3. Test file uploads and AI services
4. Configure monitoring and logging
5. Set up CI/CD pipeline

---

**Happy Containerizing! 🐳✨**

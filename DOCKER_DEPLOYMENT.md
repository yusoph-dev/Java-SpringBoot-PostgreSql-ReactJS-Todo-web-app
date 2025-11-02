# Spring Boot Todo App - Docker Deployment Guide

## Overview

This project has been fully dockerized with a comprehensive Docker setup that includes:
- Spring Boot Backend with PostgreSQL
- React Frontend with Nginx
- PostgreSQL Database
- Development and Production environments
- Health checks and monitoring
- Volume persistence
- Network isolation

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Nginx) │◄──►│   (Spring Boot) │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose V2
- Git
- 4GB+ RAM available

### 1. Clone and Setup

```bash
git clone <your-repo>
cd springboot-todo
```

### 2. Configure Environment

```bash
# Copy and edit environment files
cp .env.example .env
cp .env.prod.example .env.prod

# Edit .env for development
vim .env
```

### 3. Build and Run

```bash
# Make script executable
chmod +x docker.sh

# Build Docker images
./docker.sh build

# Start development environment
./docker.sh up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Database: localhost:5432
```

## Docker Management Script

The `docker.sh` script provides comprehensive container management:

```bash
./docker.sh [command]
```

### Available Commands

| Command | Description |
|---------|-------------|
| `build` | Build all Docker images |
| `up` | Start services (development) |
| `up-prod` | Start services (production) |
| `down` | Stop all services |
| `restart` | Restart all services |
| `logs` | Show logs from all services |
| `logs-f` | Follow logs in real-time |
| `status` | Show container status |
| `clean` | Remove containers and volumes |
| `clean-all` | Remove everything including images |
| `db-shell` | Connect to PostgreSQL shell |
| `backend-shell` | Access backend container |
| `frontend-shell` | Access frontend container |
| `test` | Run backend tests |

### Examples

```bash
# Build and start development environment
./docker.sh build && ./docker.sh up

# Monitor logs in real-time
./docker.sh logs-f

# Access database shell
./docker.sh db-shell

# Check service status
./docker.sh status

# Restart specific service
docker-compose restart backend

# Production deployment
./docker.sh up-prod
```

## Configuration

### Environment Files

#### Development (.env)
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=todoapp
DB_USER=postgres
DB_PASSWORD=postgres
SPRING_PROFILES_ACTIVE=docker
JWT_SECRET=your-secret-key-here
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

#### Production (.env.prod)
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=todoapp
DB_USER=todo_user
DB_PASSWORD=strong_production_password_2024
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-super-secure-production-secret-key-2024
BACKEND_PORT=8080
FRONTEND_PORT=80
```

### Docker Compose Configurations

- `docker-compose.yml` - Development environment
- `docker-compose.prod.yml` - Production environment

Both configurations include:
- Health checks for all services
- Volume persistence for database
- Network isolation
- Proper dependency management
- Resource constraints
- Security optimizations

## Service Details

### Frontend (React + Nginx)

- **Base Image**: `node:22.12-alpine` (build) + `nginx:1.25-alpine` (runtime)
- **Features**:
  - Multi-stage build for optimization
  - Nginx reverse proxy for API calls
  - Static file serving
  - SPA routing support
  - Health checks with curl
  - Non-root user execution

### Backend (Spring Boot)

- **Base Image**: `maven:3.9.9-amazoncorretto-21-alpine` (build) + `amazoncorretto:21-alpine-jdk` (runtime)
- **Features**:
  - Multi-stage build with Maven
  - JVM optimizations for containers
  - Database connection pooling
  - CORS configuration
  - Health endpoint monitoring
  - Non-root user execution
  - Security hardening

### Database (PostgreSQL)

- **Base Image**: `postgres:16-alpine`
- **Features**:
  - Persistent volume storage
  - Initialization scripts
  - Health checks
  - Performance tuning
  - Custom user/database setup

## Networking

- **Network**: `todo-network` (bridge)
- **Subnets**:
  - Development: `172.25.0.0/16`
  - Production: `172.26.0.0/16`
- **Internal Communication**: Services communicate via service names
- **External Access**: Only specified ports exposed to host

## Volume Management

### Persistent Volumes

- `postgres_data`: Database storage
- Automatic backup and restore capabilities
- Data persistence across container restarts

### File Mounts

Development mode includes bind mounts for:
- Live code reloading
- Configuration updates
- Log access

## Health Monitoring

### Health Check Endpoints

- **Frontend**: `http://localhost:80/`
- **Backend**: `http://localhost:8080/api/todos/stats`
- **Database**: `pg_isready` command

### Monitoring Commands

```bash
# Check all service health
docker-compose ps

# Monitor logs
./docker.sh logs-f

# Health status
curl http://localhost:8080/api/todos/stats
```

## Production Deployment

### 1. Production Build

```bash
# Use production environment
./docker.sh up-prod
```

### 2. Environment Setup

```bash
# Configure production environment
cp .env.prod.example .env.prod
# Edit .env.prod with production values
```

### 3. Security Considerations

- Change default passwords
- Use strong JWT secrets
- Configure firewall rules
- Set up SSL/TLS termination
- Enable log monitoring
- Regular security updates

### 4. Performance Tuning

- Adjust JVM heap sizes
- Configure database connection pools
- Set appropriate resource limits
- Enable container monitoring
- Implement backup strategies

## Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
./docker.sh logs [service-name]

# Verify configuration
./docker.sh status
```

#### Network Conflicts
```bash
# Clean and restart
./docker.sh clean
./docker.sh up
```

#### Database Connection Issues
```bash
# Check database health
./docker.sh db-shell

# Verify credentials in .env
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080
netstat -tulpn | grep :5432
```

### Debug Mode

```bash
# Enable debug logging
export COMPOSE_LOG_LEVEL=DEBUG
./docker.sh up

# Access container shells
./docker.sh backend-shell
./docker.sh frontend-shell
```

## Backup and Restore

### Database Backup

```bash
# Create backup
docker-compose exec database pg_dump -U todouser -d todoapp > backup.sql

# Restore backup
docker-compose exec -T database psql -U todouser -d todoapp < backup.sql
```

### Complete System Backup

```bash
# Backup volumes
docker run --rm -v springboot-todo_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v springboot-todo_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-backup.tar.gz -C /data
```

## Development Workflow

### 1. Code Changes

```bash
# Backend changes (requires rebuild)
docker-compose build backend
docker-compose up -d backend

# Frontend changes (requires rebuild)
docker-compose build frontend
docker-compose up -d frontend
```

### 2. Database Changes

```bash
# Apply migrations
./docker.sh db-shell
# Run SQL migrations manually
```

### 3. Testing

```bash
# Run backend tests
./docker.sh test

# API testing
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"Test Description","priority":"HIGH"}'
```

## Performance Monitoring

### Resource Usage

```bash
# Monitor container resources
docker stats

# Service-specific monitoring
docker stats todo-backend todo-frontend todo-database
```

### Application Metrics

- Backend: Spring Boot Actuator endpoints
- Frontend: Nginx access logs
- Database: PostgreSQL performance views

## Security Best Practices

### Container Security

- ✅ Non-root user execution
- ✅ Minimal base images (Alpine Linux)
- ✅ Multi-stage builds
- ✅ No secrets in images
- ✅ Read-only file systems where possible
- ✅ Resource constraints
- ✅ Network isolation

### Application Security

- ✅ Environment-based configuration
- ✅ Input validation
- ✅ CORS configuration
- ✅ Secure database connections
- ✅ JWT token security

## Maintenance

### Regular Tasks

1. **Update Dependencies**
   ```bash
   # Update base images
   docker-compose pull
   ./docker.sh build --no-cache
   ```

2. **Clean Up**
   ```bash
   # Remove unused resources
   docker system prune -af
   ```

3. **Monitor Logs**
   ```bash
   # Rotate logs regularly
   docker-compose logs --tail=100
   ```

4. **Backup Data**
   ```bash
   # Regular database backups
   ./backup-script.sh
   ```

## Support and Troubleshooting

For issues:
1. Check service logs: `./docker.sh logs-f`
2. Verify configuration: `./docker.sh status`
3. Test connectivity: `curl` commands
4. Review environment files
5. Check Docker resources: `docker system df`

## Next Steps

- [ ] Set up CI/CD pipeline
- [ ] Implement monitoring (Prometheus/Grafana)
- [ ] Add SSL/TLS termination
- [ ] Configure log aggregation
- [ ] Set up automated backups
- [ ] Implement secrets management
- [ ] Add performance testing
- [ ] Configure alerts and notifications
# Environment Variables Guide

This project uses environment variables for configuration management across different deployment scenarios.

## Environment File Structure

```
springboot-todo/
├── .env                    # Docker Compose environment (development)
├── .env.example           # Docker Compose environment template
├── .env.prod              # Docker Compose environment (production)
├── .env.prod.example      # Docker Compose environment template (production)
├── backend/
│   ├── .env              # Backend-specific environment variables
│   └── .env.example      # Backend environment template
└── frontend/
    ├── .env              # Frontend-specific environment variables
    └── .env.example      # Frontend environment template
```

## Environment Files Purpose

### Root Level (.env)
Used by Docker Compose for container orchestration and service configuration.

### Backend (.env)
Contains Spring Boot application configuration for local development.

### Frontend (.env)
Contains React/Vite configuration for local development and build processes.

## Security Considerations

### ✅ **Secure (Environment Variables)**
- Database passwords via `DB_PASSWORD`
- JWT secrets via `JWT_SECRET`
- API URLs via `VITE_API_URL`
- CORS origins via `CORS_ALLOWED_ORIGINS`

### ❌ **Avoid (Hardcoded Values)**
- No hardcoded passwords in source code
- No hardcoded API endpoints
- No hardcoded database URLs
- No sensitive keys in configuration files

## Configuration Examples

### Local Development Setup

1. **Backend Configuration (`backend/.env`)**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todoapp
DB_USERNAME=postgres
DB_PASSWORD=your_local_password
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

2. **Frontend Configuration (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:8080
VITE_PORT=3000
VITE_APP_TITLE=Spring Boot Todo App
```

3. **Docker Development (`.env`)**
```env
DB_PASSWORD=docker_dev_password
JWT_SECRET=dev-secret-key
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

### Production Setup

1. **Docker Production (`.env.prod`)**
```env
DB_PASSWORD=super_secure_production_password_2024
JWT_SECRET=ultra-secure-production-jwt-key-2024
BACKEND_PORT=8080
FRONTEND_PORT=80
```

## Environment Variable Reference

### Database Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_PORT` | Database port | `5432` | Yes |
| `DB_NAME` | Database name | `todoapp` | Yes |
| `DB_USERNAME` | Database username | `postgres` | Yes |
| `DB_PASSWORD` | Database password | - | Yes |

### Backend Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SERVER_PORT` | Backend server port | `8080` | No |
| `SPRING_PROFILES_ACTIVE` | Spring profile | `dev` | No |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` | No |
| `JWT_SECRET` | JWT signing secret | - | Future use |

### Frontend Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` | No |
| `VITE_PORT` | Dev server port | `3000` | No |
| `VITE_HOST` | Dev server host | `0.0.0.0` | No |
| `VITE_APP_TITLE` | Application title | `Spring Boot Todo App` | No |

## Setup Instructions

### 1. Initial Setup
```bash
# Copy example files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit with your values
vim backend/.env    # Configure database credentials
vim frontend/.env   # Configure API URL if needed
```

### 2. Docker Development
```bash
# Edit Docker environment
vim .env

# Build and run
./docker.sh build && ./docker.sh up
```

### 3. Local Development
```bash
# Backend
cd backend
vim .env    # Configure local database
./mvnw spring-boot:run

# Frontend (in another terminal)
cd frontend
vim .env    # Configure API URL
npm run dev
```

### 4. Production Deployment
```bash
# Configure production environment
cp .env.prod.example .env.prod
vim .env.prod    # Set secure passwords and secrets

# Deploy
./docker.sh up-prod
```

## Security Best Practices

### 🔒 **Environment File Security**
- Never commit `.env` files to version control
- Use `.env.example` files as templates
- Rotate secrets regularly in production
- Use strong, unique passwords for each environment
- Limit environment variable access to necessary personnel

### 🛡️ **Production Security**
- Use environment-specific secrets
- Enable SSL/TLS for all connections
- Use secure random JWT secrets (256-bit minimum)
- Restrict CORS origins to specific domains
- Enable database connection encryption
- Use secrets management systems for sensitive data

### 📋 **Environment Validation**
```bash
# Check backend environment
cd backend && cat .env

# Check frontend environment  
cd frontend && cat .env

# Validate Docker environment
docker-compose config
```

## Troubleshooting

### Common Issues

**Backend won't connect to database:**
```bash
# Check database configuration
echo $DB_HOST $DB_PORT $DB_NAME $DB_USERNAME
```

**Frontend can't reach API:**
```bash
# Check API URL configuration
echo $VITE_API_URL
```

**Docker containers fail to start:**
```bash
# Check Docker environment
cat .env
docker-compose config
```

### Environment Debugging
```bash
# Print all environment variables
printenv | grep -E "(DB_|VITE_|SERVER_|SPRING_)"

# Test backend configuration
cd backend && ./mvnw spring-boot:run --debug

# Test frontend configuration
cd frontend && npm run dev -- --debug
```

## Migration Notes

**⚠️ Breaking Changes:**
- Moved environment files to service-specific directories
- Changed hardcoded values to environment variables
- Updated API URL configuration mechanism
- Modified CORS configuration to use environment variables

**Migration Steps:**
1. Copy environment files to new locations
2. Update configuration values
3. Test local development setup
4. Verify Docker deployment
5. Update production environment files
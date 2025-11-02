# Spring Boot Todo Application

A full-stack todo application built with Spring Boot, React, and PostgreSQL, fully containerized with Docker.

## Quick Start (Docker)

```bash
# Clone the repository
git clone <your-repo>
cd springboot-todo

# Build and run with Docker
chmod +x docker.sh
./docker.sh build && ./docker.sh up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```

## Features

- **Full CRUD Operations** - Create, read, update, delete todos
- **Priority Management** - Low, Medium, High priority levels
- **Due Date Support** - Optional due dates for todos
- **Status Tracking** - Mark todos as complete/incomplete
- **Statistics Dashboard** - View completion rates and priority distribution
- **Responsive Design** - Mobile-friendly UI with Material-UI
- **Real-time Updates** - Instant UI updates after operations
- **Dockerized Deployment** - Complete containerization for all services
- **Production Ready** - Separate dev/prod configurations

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Nginx) │◄──►│   (Spring Boot) │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.4.11 with Java 21
- **Database**: PostgreSQL with Spring Data JPA
- **Features**: REST API, CORS support, validation, exception handling
- **Build Tool**: Maven with wrapper

### Frontend (React)
- **Framework**: React 19 with TypeScript
- **UI Library**: Material-UI v7 + Bootstrap 4
- **Build Tool**: Vite
- **Features**: Responsive design, form validation, real-time updates

### Database (PostgreSQL)
- **Version**: PostgreSQL 16
- **Features**: ACID compliance, JSON support, full-text search ready

## Docker Deployment

### Prerequisites
- Docker Engine 20.10+
- Docker Compose V2
- 4GB+ RAM available

### Quick Setup

```bash
# Copy and configure environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit environment files with your configuration
vim .env backend/.env frontend/.env

# Start development environment
./docker.sh up

# View logs
./docker.sh logs-f

# Stop services
./docker.sh down
```

### Production Environment

```bash
# Configure production settings
cp .env.prod.example .env.prod
# Edit .env.prod with your production values

# Deploy to production
./docker.sh up-prod
```

### Docker Management

```bash
./docker.sh [command]
```

**Available Commands:**
- `build` - Build Docker images
- `up` / `up-prod` - Start dev/prod environment
- `down` - Stop all services
- `restart` - Restart all services
- `logs` / `logs-f` - View logs
- `status` - Check service status
- `clean` - Remove containers and volumes
- `db-shell` - Access PostgreSQL shell
- `backend-shell` / `frontend-shell` - Access container shells

For detailed Docker deployment guide, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md).

**Environment Configuration**: See [ENVIRONMENT_GUIDE.md](./ENVIRONMENT_GUIDE.md) for detailed environment variable setup.

## Local Development (Non-Docker)

### Backend Setup

```bash
cd backend

# Ensure Java 21 is installed
java --version

# Install PostgreSQL and create database
createdb todoapp

# Configure application.yaml with your database credentials

# Run the application
./mvnw spring-boot:run

# API will be available at http://localhost:8080
```

### Frontend Setup

```bash
cd frontend

# Ensure Node.js 18+ is installed
node --version

# Install dependencies
npm install

# Start development server
npm run dev

# Application will be available at http://localhost:3000
```

### Database Setup

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database and user
CREATE DATABASE todoapp;
CREATE USER todouser WITH PASSWORD 'todopass';
GRANT ALL PRIVILEGES ON DATABASE todoapp TO todouser;
```

## API Endpoints

### Todo Management

```bash
# Get all todos
GET /api/todos

# Get todos with priority ordering
GET /api/todos?orderByPriority=true

# Get todo by ID
GET /api/todos/{id}

# Create new todo
POST /api/todos
Content-Type: application/json
{
  "title": "Learn Docker",
  "description": "Complete Docker tutorial",
  "priority": "HIGH",
  "dueDate": "2024-12-31"
}

# Update todo
PUT /api/todos/{id}
Content-Type: application/json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "MEDIUM",
  "completed": true
}

# Toggle todo completion
PATCH /api/todos/{id}/toggle

# Delete todo
DELETE /api/todos/{id}

# Get statistics
GET /api/todos/stats
```

### Response Examples

**Todo Object:**
```json
{
  "id": 1,
  "title": "Learn Spring Boot",
  "description": "Complete Spring Boot tutorial",
  "completed": false,
  "priority": "HIGH",
  "createdAt": "2024-11-02T10:30:00",
  "updatedAt": "2024-11-02T10:30:00",
  "dueDate": "2024-12-31T00:00:00"
}
```

**Statistics:**
```json
{
  "total": 10,
  "completed": 6,
  "pending": 4,
  "highPriority": 3,
  "mediumPriority": 4,
  "lowPriority": 3
}
```

## Frontend Features

### Components
- **TodoCard** - Individual todo item with actions
- **TodoForm** - Create/edit todo dialog
- **TodoStats** - Statistics dashboard
- **App** - Main application layout

### UI Features
- Material-UI components for consistent design
- Bootstrap 4 for responsive grid system
- Mobile-first responsive design
- Form validation and error handling
- Loading states and user feedback
- Priority color coding
- Due date visualization

## Configuration

### Environment Variables

**Development (.env):**
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=todoapp
DB_USER=postgres
DB_PASSWORD=postgres
SPRING_PROFILES_ACTIVE=docker
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

**Production (.env.prod):**
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=todoapp
DB_USER=todo_user
DB_PASSWORD=your_secure_password
SPRING_PROFILES_ACTIVE=prod
BACKEND_PORT=8080
FRONTEND_PORT=80
```

### CORS Configuration

Backend is configured to allow requests from:
- `http://localhost:3000` (development)
- `http://localhost:5173` (Vite dev server)
- Frontend container in Docker

## Testing

### Backend Tests
```bash
# Run unit tests
cd backend
./mvnw test

# With Docker
./docker.sh test
```

### API Testing
```bash
# Test API endpoints
curl -X GET http://localhost:8080/api/todos/stats
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","priority":"HIGH"}'
```

## Monitoring

### Health Checks
- **Backend**: `GET /api/todos/stats`
- **Frontend**: `GET /` (nginx status)
- **Database**: PostgreSQL `pg_isready`

### Logging
```bash
# View all logs
./docker.sh logs-f

# Service-specific logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

## Production Deployment

1. **Configure Environment**
   ```bash
   cp .env.prod.example .env.prod
   # Edit with production values
   ```

2. **Deploy Services**
   ```bash
   ./docker.sh up-prod
   ```

3. **Verify Deployment**
   ```bash
   ./docker.sh status
   curl http://localhost:80  # Frontend
   curl http://localhost:8080/api/todos/stats  # Backend API
   ```

4. **Set up Reverse Proxy (Optional)**
   - Configure Nginx/Apache for SSL termination
   - Set up domain routing
   - Enable HTTPS

## Security

- Non-root user execution in containers
- Environment-based configuration
- Input validation and sanitization
- CORS protection
- SQL injection prevention via JPA
- Secure database connections

## Project Structure

```
springboot-todo/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   ├── Dockerfile          # Backend container
│   └── pom.xml            # Maven dependencies
├── frontend/               # React application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── Dockerfile         # Frontend container
│   └── package.json       # NPM dependencies
├── database/              # Database scripts
│   └── init-scripts/      # Initialization SQL
├── docker-compose.yml     # Development environment
├── docker-compose.prod.yml # Production environment
├── docker.sh              # Management script
├── .env                   # Development environment
├── .env.prod              # Production environment
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test with Docker: `./docker.sh build && ./docker.sh up`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support:
- Create an issue on GitHub
- Check the [Docker Deployment Guide](./DOCKER_DEPLOYMENT.md)
- Review the logs: `./docker.sh logs-f`

## Roadmap

- [ ] User authentication and authorization
- [ ] Todo categories and tags  
- [ ] File attachments
- [ ] Reminders and notifications
- [ ] API rate limiting
- [ ] Advanced search and filtering
- [ ] Data export/import
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Performance monitoring dashboard

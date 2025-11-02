# Spring Boot Todo Application

A full-stack todo application built with Spring Boot, React, and PostgreSQL, fully containerized with Docker.

## Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/yusoph-dev/Java-SpringBoot-PostgreSql-ReactJS-Todo-web-app.git
cd springboot-todo

# Build and run with Docker
chmod +x docker.sh
./docker.sh build && ./docker.sh up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```

## Features

- **User Authentication** - Secure JWT-based authentication system
  - User registration and login
  - Profile management (update email, name, password)
  - Account deletion with confirmation
  - Protected routes and API endpoints
- **Role-Based Access Control** - Admin and user roles
  - Admin users can view and manage all todos
  - Regular users can only access their own todos
  - Role-based permissions enforced on backend and frontend
- **Full CRUD Operations** - Create, read, update, delete todos
- **Priority Management** - Low, Medium, High priority levels
- **Due Date Support** - Optional due dates for todos
- **Status Tracking** - Mark todos as complete/incomplete
- **Statistics Dashboard** - View completion rates and priority distribution
- **Responsive Design** - Mobile-friendly UI with Material-UI v7
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
- **Security**: Spring Security with JWT authentication (HS384, 24h expiration)
- **Database**: PostgreSQL with Spring Data JPA
- **Features**: REST API, CORS support, validation, exception handling, role-based access control
- **Password Encryption**: BCrypt with strength 10
- **Build Tool**: Maven with wrapper

### Frontend (React)
- **Framework**: React 19 with TypeScript
- **UI Library**: Material-UI v7
- **Routing**: React Router v7.1.0 with protected routes
- **Build Tool**: Vite
- **Features**: Responsive design, form validation, real-time updates, authentication context, JWT token management

### Database (PostgreSQL)
- **Version**: PostgreSQL 16
- **Schema**: Users table with role enum (USER, ADMIN), Todos table with user ownership
- **Features**: ACID compliance, foreign key constraints, cascade delete, JSON support, full-text search ready
- **Default Users**: Admin user (username: `admin`, password: `password123`)

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

-- Tables are automatically created by JPA
-- Default admin user is created on startup:
--   Username: admin
--   Password: password123
--   Role: ADMIN
```

### Default Credentials

**Admin User:**
- Username: `admin`
- Password: `password123`
- Role: ADMIN (can view and manage all todos)

**Test User:**
- You can register your own user account through the registration page
- New users have USER role by default (can only view/manage their own todos)

## User Roles & Permissions

### Admin Role
- View all todos from all users
- Access to all statistics (total counts across all users)
- Can manage their own profile
- Full CRUD operations on todos

### User Role
- View only their own todos
- Access to their own statistics
- Can manage their own profile
- Full CRUD operations on their own todos
- Cannot view or access other users' todos

### Role Assignment
- Default role for new registrations: `USER`
- Admin role must be assigned manually in the database
- Roles are stored as ENUM type in PostgreSQL (USER, ADMIN)

## Docker Deployment

## API Endpoints

### Authentication

```bash
# Register new user
POST /api/auth/register
Content-Type: application/json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

# Login
POST /api/auth/login
Content-Type: application/json
{
  "username": "johndoe",
  "password": "password123"
}
# Returns: { "token": "jwt_token", "user": {...} }

# Get current user profile
GET /api/auth/me
Authorization: Bearer {token}

# Update user profile
PUT /api/auth/me
Authorization: Bearer {token}
Content-Type: application/json
{
  "email": "newemail@example.com",
  "firstName": "John",
  "lastName": "Smith"
}

# Change password
PUT /api/auth/me
Authorization: Bearer {token}
Content-Type: application/json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}

# Delete account
DELETE /api/auth/me
Authorization: Bearer {token}
```

### Todo Management

**Note**: All todo endpoints require authentication. Include the JWT token in the Authorization header.

```bash
# Get all todos (users see their own, admins see all)
GET /api/todos
Authorization: Bearer {token}

# Get todos with priority ordering
GET /api/todos?orderByPriority=true
Authorization: Bearer {token}

# Get todo by ID
GET /api/todos/{id}
Authorization: Bearer {token}

# Create new todo
POST /api/todos
Authorization: Bearer {token}
Content-Type: application/json
{
  "title": "Learn Docker",
  "description": "Complete Docker tutorial",
  "priority": "HIGH",
  "dueDate": "2024-12-31"
}

# Update todo
PUT /api/todos/{id}
Authorization: Bearer {token}
Content-Type: application/json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "MEDIUM",
  "completed": true
}

# Toggle todo completion
PATCH /api/todos/{id}/toggle
Authorization: Bearer {token}

# Delete todo
DELETE /api/todos/{id}
Authorization: Bearer {token}

# Get statistics (user's stats or all stats for admin)
GET /api/todos/stats
Authorization: Bearer {token}
```

### Response Examples

**Authentication Response:**
```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

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

### Pages
- **Login** - User authentication with error handling
- **Register** - New user registration with validation
- **Todos** - Main todo management page with CRUD operations
- **Profile** - User profile management and account settings

### Components
- **AuthContext** - Global authentication state management
- **ProtectedRoute** - Route guard for authenticated pages
- **TodoCard** - Individual todo item with actions
- **TodoForm** - Create/edit todo dialog
- **TodoStats** - Statistics dashboard
- **Navbar** - Navigation with user menu and logout

### UI Features
- Material-UI v7 components for consistent design
- Mobile-first responsive design
- Form validation and error handling
- Loading states and user feedback
- Priority color coding
- Due date visualization
- JWT token management with axios interceptors
- Automatic token refresh handling
- Protected routes with redirect to login

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
# Login to get JWT token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' | jq -r '.token')

# Test authenticated endpoints
curl -X GET http://localhost:8080/api/todos/stats \
  -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:8080/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","priority":"HIGH"}'

# Test user registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User"
  }'
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

- **Authentication**: JWT-based authentication with HS384 algorithm
- **Password Security**: BCrypt hashing with strength 10
- **Token Management**: 24-hour token expiration, stored in localStorage
- **Authorization**: Role-based access control (USER, ADMIN)
- **Protected Routes**: Frontend route guards for authenticated pages
- **Protected Endpoints**: Backend Spring Security filters for API endpoints
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Request validation with Bean Validation
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries
- **Container Security**: Non-root user execution in Docker
- **Environment Configuration**: Sensitive data in environment variables
- **Cascade Delete**: User deletion automatically removes associated todos

## Project Structure

```
springboot-todo/
├── backend/                      # Spring Boot application
│   ├── src/main/java/com/yusoph/todo/
│   │   ├── controller/          # REST controllers
│   │   │   ├── TodoController.java
│   │   │   └── AuthController.java
│   │   ├── service/             # Business logic
│   │   │   ├── TodoService.java
│   │   │   ├── AuthService.java
│   │   │   └── UserService.java
│   │   ├── repository/          # Data access
│   │   │   ├── TodoRepository.java
│   │   │   └── UserRepository.java
│   │   ├── entity/              # JPA entities
│   │   │   ├── Todo.java
│   │   │   └── User.java
│   │   ├── dto/                 # Data transfer objects
│   │   ├── config/              # Security & JWT config
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtService.java
│   │   │   └── JwtAuthFilter.java
│   │   └── exception/           # Exception handling
│   ├── src/main/resources/
│   │   └── application.yaml     # Application config
│   ├── Dockerfile               # Backend container
│   └── pom.xml                  # Maven dependencies
├── frontend/                     # React application
│   ├── src/
│   │   ├── pages/               # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── TodosPage.tsx
│   │   │   └── Profile.tsx
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── components/          # Reusable components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── TodoCard.tsx
│   │   │   └── TodoForm.tsx
│   │   ├── api/                 # API client
│   │   │   └── todoApi.ts
│   │   ├── App.tsx              # Root component with routing
│   │   └── main.tsx             # Entry point
│   ├── public/                  # Static assets
│   ├── Dockerfile               # Frontend container
│   ├── package.json             # NPM dependencies
│   └── .env                     # Frontend environment
├── database/                     # Database scripts
│   └── init-scripts/
│       └── 01-init.sql          # Schema & default users
├── docker-compose.yml           # Development environment
├── docker-compose.prod.yml      # Production environment
├── docker.sh                    # Management script
├── .env                         # Development environment
├── .env.prod                    # Production environment
└── README.md                    # This file
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

- [x] User authentication and authorization
- [x] Role-based access control (Admin/User)
- [x] User profile management
- [x] JWT token authentication
- [ ] Todo categories and tags  
- [ ] File attachments
- [ ] Reminders and notifications
- [ ] Email verification
- [ ] Password reset functionality
- [ ] API rate limiting
- [ ] Advanced search and filtering
- [ ] Todo sharing between users
- [ ] Data export/import
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration with WebSocket
- [ ] Performance monitoring dashboard
- [ ] OAuth2 social login (Google, GitHub)

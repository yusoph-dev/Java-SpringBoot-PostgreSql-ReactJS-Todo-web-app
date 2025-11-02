# Spring Boot Todo Backend

A RESTful API backend for a Todo application built with Spring Boot, JPA, and PostgreSQL.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Java 21** or higher
- **PostgreSQL 14+** 
- **Maven** (or use the included Maven wrapper)

## Database Setup

1. **Start PostgreSQL service:**
   ```bash
   brew services start postgresql@14
   ```

2. **Create the database:**
   ```bash
   createdb todoapp
   ```

3. **Verify database connection:**
   ```bash
   psql todoapp -c "SELECT 'Database connection successful!' as status;"
   ```

## Configuration

The application is configured to connect to PostgreSQL with the following default settings:

- **Database:** `todoapp`
- **Host:** `localhost:5432`
- **Username:** `yusoph`
- **Password:** (none - using local trust authentication)

These settings can be modified in `src/main/resources/application.yaml`.

## Running the Application

### Method 1: Using Maven Wrapper (Recommended)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Start the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

### Method 2: Run in Background

To run the application in the background (useful for development):

```bash
nohup ./mvnw spring-boot:run > spring-boot.log 2>&1 &
```

### Method 3: Build and Run JAR

1. **Build the application:**
   ```bash
   ./mvnw clean package
   ```

2. **Run the JAR file:**
   ```bash
   ./mvnw spring-boot:run
   ```

## Stopping the Application

### If running in foreground:
Press `Ctrl + C` in the terminal where the application is running.

### If running in background:

1. **Find the process ID:**
   ```bash
   ps aux | grep "spring-boot:run\|todo-app"
   ```

2. **Kill the process:**
   ```bash
   kill [PID]
   ```

   Or use a more targeted approach:
   ```bash
   pkill -f "spring-boot:run"
   # For JAR-based processes:
   pkill -f "todo-app-0.0.1-SNAPSHOT.jar"
   ```

### Alternative: Using lsof to find process by port

```bash
# Find process using port 8080
lsof -ti:8080 | xargs kill -9
```

## Application Information

- **Server Port:** `8080`
- **Base URL:** `http://localhost:8080`
- **API Base Path:** `/api/todos`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos/{id}` | Get a specific todo |
| PUT | `/api/todos/{id}` | Update a todo |
| PATCH | `/api/todos/{id}/toggle` | Toggle todo completion |
| DELETE | `/api/todos/{id}` | Delete a todo |
| GET | `/api/todos/search` | Search todos |
| GET | `/api/todos/stats` | Get todo statistics |

## Testing the API

### Create a new todo:
```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Todo",
    "description": "This is a test todo item",
    "priority": "MEDIUM"
  }'
```

### Get all todos:
```bash
curl -X GET http://localhost:8080/api/todos
```

### Update a todo:
```bash
curl -X PUT http://localhost:8080/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Todo",
    "description": "Updated description",
    "priority": "HIGH",
    "completed": true
  }'
```

## Logs and Monitoring

### View application logs:
```bash
# If running in background
tail -f spring-boot.log

# If running with systemd (production)
journalctl -u spring-boot-todo -f
```

### Check application health:
```bash
curl http://localhost:8080/actuator/health
```

## Troubleshooting

### Common Issues:

1. **Port 8080 already in use:**
   ```bash
   # Find and kill process using port 8080
   lsof -ti:8080 | xargs kill -9
   ```

2. **Database connection failed:**
   - Ensure PostgreSQL is running: `brew services restart postgresql@14`
   - Verify database exists: `psql -l | grep todoapp`
   - Check credentials in `application.yaml`

3. **Java version issues:**
   ```bash
   # Check Java version
   java -version
   
   # If using multiple Java versions, set JAVA_HOME
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   ```

4. **Maven wrapper permission issues:**
   ```bash
   chmod +x mvnw
   ```

## Development Mode

For development with automatic restart on file changes:

```bash
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=dev"
```

## Building for Production

```bash
# Clean and build
./mvnw clean package -DskipTests

# Run with production profile
java -jar target/todo-app-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## Environment Variables

You can override configuration using environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/todoapp
export SPRING_DATASOURCE_USERNAME=yusoph
export SPRING_DATASOURCE_PASSWORD=yourpassword
export SERVER_PORT=8080
```

## Support

If you encounter any issues, check the application logs first:
- Console output (if running in foreground)
- `spring-boot.log` file (if running in background)
- Database connectivity using `psql todoapp`

---

**Note:** This application uses Spring Boot's development profile by default, which includes helpful features like automatic database schema creation and detailed error messages.
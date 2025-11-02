# Authentication System Documentation

This document describes the user authentication system implemented in the Todo App.

## Overview

The application now includes JWT-based authentication with the following features:
- User registration and login
- Secure password storage (BCrypt)
- JWT token-based authentication
- User profile management
- Todo ownership and access control

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT true,
    account_non_expired BOOLEAN NOT NULL DEFAULT true,
    account_non_locked BOOLEAN NOT NULL DEFAULT true,
    credentials_non_expired BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

### Todos Table (Updated)
```sql
ALTER TABLE todos ADD COLUMN user_id BIGINT NOT NULL;
ALTER TABLE todos ADD CONSTRAINT fk_todos_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

## API Endpoints

### Authentication Endpoints

#### 1. Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "createdAt": "2024-11-02T10:30:00",
  "updatedAt": "2024-11-02T10:30:00"
}
```

#### 4. Update User Profile
```http
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "newemail@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "role": "USER",
  "createdAt": "2024-11-02T10:30:00",
  "updatedAt": "2024-11-02T10:35:00"
}
```

#### 5. Delete Account
```http
DELETE /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

#### 6. Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Note:** JWT tokens are stateless, so logout is primarily handled client-side by removing the token.

### Todo Endpoints (Now Require Authentication)

All todo endpoints now require the `Authorization: Bearer <token>` header and will only return/modify todos belonging to the authenticated user.

```http
GET /api/todos
Authorization: Bearer <token>
```

## Testing with cURL

### 1. Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Save the returned token from the response.

### 3. Get current user
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create a todo (authenticated)
```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first authenticated todo",
    "description": "This todo belongs to me",
    "priority": "HIGH"
  }'
```

### 5. Get all todos (only yours)
```bash
curl -X GET http://localhost:8080/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Update profile
```bash
curl -X PUT http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

### 7. Change password
```bash
curl -X PUT http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }'
```

## Testing with Postman

1. **Create a new environment** with variable `baseUrl` = `http://localhost:8080`
2. **Register/Login** and save the token to environment variable `token`
3. **Add Authorization header** to requests:
   - Type: Bearer Token
   - Token: `{{token}}`

## Migration Guide

If you have existing data:

1. **Backup your database:**
```bash
docker-compose exec database pg_dump -U todouser todoapp > backup.sql
```

2. **Run the migration script:**
```bash
docker-compose exec database psql -U todouser -d todoapp -f /docker-entrypoint-initdb.d/migrations/001_add_user_authentication.sql
```

Or from your host machine:
```bash
psql -U todouser -h localhost -d todoapp -f database/migrations/001_add_user_authentication.sql
```

3. **Default admin user is created:**
   - Username: `admin`
   - Password: `password123`
   - **Change this password immediately!**

## Security Features

1. **Password Encryption**: BCrypt with strength 10
2. **JWT Tokens**: HS256 algorithm, 24-hour expiration
3. **CSRF Protection**: Disabled (using JWT instead)
4. **CORS**: Configured for localhost:3000 and localhost:5173
5. **Stateless Sessions**: JWT-based, no server-side session storage
6. **Access Control**: Users can only access their own todos
7. **Input Validation**: Jakarta Validation on all DTOs

## Environment Variables

Add these to your `.env` file:

```bash
# JWT Configuration
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
```

**Important:** Change the `JWT_SECRET` to a secure random value in production!

Generate a secure secret:
```bash
openssl rand -base64 64
```

## Error Responses

### 401 Unauthorized
```json
{
  "timestamp": "2024-11-02T10:30:00",
  "status": 401,
  "error": "Authentication Failed",
  "message": "Invalid username or password",
  "path": "/api/auth/login"
}
```

### 409 Conflict (User Already Exists)
```json
{
  "timestamp": "2024-11-02T10:30:00",
  "status": 409,
  "error": "User Already Exists",
  "message": "Username already exists: johndoe",
  "path": "/api/auth/register"
}
```

### 403 Forbidden (Access Denied)
```json
{
  "timestamp": "2024-11-02T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to access this todo",
  "path": "/api/todos/123"
}
```

## Token Management

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Payload
```json
{
  "sub": "johndoe",
  "iat": 1699012345,
  "exp": 1699098745
}
```

### Token Expiration
- Default: 24 hours (86400000 milliseconds)
- Configurable via `JWT_EXPIRATION` environment variable
- On expiration, user must login again

## Best Practices

1. **Store tokens securely** on the client side (localStorage or httpOnly cookies)
2. **Always use HTTPS** in production
3. **Change default passwords** immediately
4. **Use strong JWT secrets** (minimum 256 bits)
5. **Implement token refresh** for better UX (optional enhancement)
6. **Rate limit** authentication endpoints to prevent brute force attacks
7. **Monitor failed login attempts** and implement account locking if needed

## Troubleshooting

### "User not found" error
- Ensure you're using the correct username (not email) for login
- Check if user exists in database

### "Invalid username or password"
- Verify password is correct
- Check if account is enabled

### "Token expired"
- Login again to get a new token
- Consider implementing refresh tokens

### "You don't have permission"
- Ensure you're accessing your own todos
- Check if the todo belongs to your user ID

## Next Steps

1. Test all authentication endpoints
2. Update frontend to implement login/register pages
3. Store JWT token in frontend
4. Add token to all API requests
5. Implement logout functionality
6. Add password reset feature (future enhancement)
7. Add email verification (future enhancement)

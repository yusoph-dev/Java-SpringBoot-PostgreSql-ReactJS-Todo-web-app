# Todo App Frontend

A modern React frontend for the Spring Boot Todo application, built with Material UI and Bootstrap 4.

## Features

- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Material UI** - Modern Google Material Design components
- **Bootstrap 4** - Flexible grid system and utilities
- **Real-time Statistics** - Dashboard with todo completion metrics
- **Advanced Filtering** - Search by title, filter by priority and status
- **Interactive UI** - Smooth animations and user feedback
- **Real-time Updates** - Automatically refreshes data after operations

## Technologies Used

- **React 19** with TypeScript
- **Material UI (MUI)** - UI component library
- **Bootstrap 4** - CSS framework for responsive design
- **Axios** - HTTP client for API calls
- **Vite** - Fast development build tool

## Prerequisites

- **Node.js 20.19+** or **Node.js 22.12+** (required by Vite)
- **npm** or **yarn** package manager
- **Backend server running** on `http://localhost:8080`

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
# Default method (configured to run on port 3000)
npm run dev

# With Node.js memory optimization (if needed)
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

**Note**: The server is configured to run on port 3000 by default. Use the NODE_OPTIONS command if you encounter Node.js version compatibility issues.

### 3. Access the Application

- **Local**: http://localhost:3000
- **Network**: http://YOUR_IP:3000

## API Configuration

The frontend connects to the backend API at `http://localhost:8080/api`. 

If your backend runs on a different port, update the `API_BASE_URL` in `src/api/todoApi.ts`:

```typescript
const API_BASE_URL = 'http://localhost:YOUR_PORT/api';
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/
│   └── todoApi.ts          # API service and type definitions
├── components/
│   ├── TodoCard.tsx        # Individual todo item component
│   ├── TodoForm.tsx        # Create/edit todo modal
│   └── TodoStats.tsx       # Statistics dashboard component
├── App.tsx                 # Main application component
├── main.tsx                # Application entry point
└── index.css               # Global styles
```

## Running Both Servers

### Backend (Spring Boot)
```bash
cd ../backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000 (configured in vite.config.ts)
```

## API Integration

The frontend integrates with the Spring Boot backend using these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/todos` | GET | Get all todos |
| `/api/todos` | POST | Create new todo |
| `/api/todos/{id}` | GET | Get specific todo |
| `/api/todos/{id}` | PUT | Update todo |
| `/api/todos/{id}/toggle` | PATCH | Toggle completion |
| `/api/todos/{id}/complete` | PATCH | Mark as completed |
| `/api/todos/{id}/incomplete` | PATCH | Mark as incomplete |
| `/api/todos/{id}` | DELETE | Delete todo |
| `/api/todos/stats` | GET | Get statistics |
| `/api/todos/search` | GET | Search todos |

## Troubleshooting

### Common Issues

1. **"Failed to load todos"**
   - Ensure backend server is running on port 8080
   - Check CORS configuration in backend

2. **Node.js version error**
   - Upgrade Node.js to version 20.19+ or 22.12+

3. **Port already in use**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

---

**Note**: Make sure the Spring Boot backend is running before starting the frontend development server.

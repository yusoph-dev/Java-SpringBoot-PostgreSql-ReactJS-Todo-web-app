import axios from 'axios';

// API Base URL - configurable via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '/api'  // Nginx proxy will handle this in Docker
    : 'http://localhost:8080/api');

// Auth interfaces
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string | null;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string | null;
}

export interface UpdateTodoRequest {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  completed: boolean;
  dueDate?: string | null;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

// Token management
const TOKEN_KEY = 'auth_token';

export const tokenManager = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const todoApi = {
  // Get all todos
  getAllTodos: (): Promise<Todo[]> => 
    api.get('/todos').then(response => response.data),

  // Get todo by ID
  getTodoById: (id: number): Promise<Todo> => 
    api.get(`/todos/${id}`).then(response => response.data),

  // Create new todo
  createTodo: (todo: CreateTodoRequest): Promise<Todo> => 
    api.post('/todos', todo).then(response => response.data),

  // Update todo
  updateTodo: (id: number, todo: UpdateTodoRequest): Promise<Todo> => 
    api.put(`/todos/${id}`, todo).then(response => response.data),

  // Toggle todo completion
  toggleTodo: (id: number): Promise<Todo> => 
    api.patch(`/todos/${id}/toggle`).then(response => response.data),

  // Delete todo
  deleteTodo: (id: number): Promise<void> => 
    api.delete(`/todos/${id}`).then(() => {}),

  // Search todos
  searchTodos: (params: {
    title?: string;
    completed?: boolean;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<Todo[]> => 
    api.get('/todos/search', { params }).then(response => response.data),

  // Get todo statistics
  getTodoStats: (): Promise<TodoStats> => 
    api.get('/todos/stats').then(response => response.data),
};

// Authentication API
export const authApi = {
  // Register new user
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    api.post('/auth/register', data).then(response => {
      const authResponse = response.data;
      tokenManager.setToken(authResponse.token);
      return authResponse;
    }),

  // Login
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(response => {
      const authResponse = response.data;
      tokenManager.setToken(authResponse.token);
      return authResponse;
    }),

  // Logout
  logout: (): Promise<void> =>
    api.post('/auth/logout').then(() => {
      tokenManager.removeToken();
    }),

  // Get current user
  getCurrentUser: (): Promise<User> =>
    api.get('/auth/me').then(response => response.data),

  // Update user profile
  updateUser: (data: UpdateUserRequest): Promise<User> =>
    api.put('/auth/me', data).then(response => response.data),

  // Delete account
  deleteAccount: (): Promise<void> =>
    api.delete('/auth/me').then(() => {
      tokenManager.removeToken();
    }),
};
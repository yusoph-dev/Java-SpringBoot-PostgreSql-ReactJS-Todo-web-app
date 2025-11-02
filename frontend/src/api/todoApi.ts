import axios from 'axios';

// API Base URL - configurable via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '/api'  // Nginx proxy will handle this in Docker
    : 'http://localhost:8080/api');

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

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
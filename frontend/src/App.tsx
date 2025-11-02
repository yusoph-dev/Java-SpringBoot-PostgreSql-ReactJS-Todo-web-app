import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';

import { todoApi } from './api/todoApi';
import type { Todo, CreateTodoRequest, UpdateTodoRequest, TodoStats } from './api/todoApi';
import TodoCard from './components/TodoCard';
import TodoForm from './components/TodoForm';
import TodoStatsComponent from './components/TodoStats';

// Create Material UI theme with responsive breakpoints
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    h4: {
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h6: {
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (max-width:600px)': {
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
      },
    },
  },
});

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Responsive breakpoints
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Load todos and stats
  const loadTodos = async () => {
    try {
      setLoading(true);
      const [todosData, statsData] = await Promise.all([
        todoApi.getAllTodos(),
        todoApi.getTodoStats()
      ]);
      setTodos(todosData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Make sure the backend server is running on port 8080.');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // Filter todos based on search and filters
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = !priorityFilter || todo.priority === priorityFilter;
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'completed' && todo.completed) ||
                         (statusFilter === 'pending' && !todo.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleCreateTodo = async (todoData: CreateTodoRequest) => {
    try {
      await todoApi.createTodo(todoData);
      await loadTodos(); // Reload to get updated data
      setError(null);
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
    }
  };

  const handleUpdateTodo = async (todoData: UpdateTodoRequest) => {
    if (!editingTodo) return;
    
    try {
      await todoApi.updateTodo(editingTodo.id!, todoData);
      await loadTodos(); // Reload to get updated data
      setEditingTodo(null);
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      await todoApi.toggleTodo(id);
      await loadTodos(); // Reload to get updated data
      setError(null);
    } catch (err) {
      setError('Failed to toggle todo');
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoApi.deleteTodo(id);
        await loadTodos(); // Reload to get updated data
        setError(null);
      } catch (err) {
        setError('Failed to delete todo');
        console.error('Error deleting todo:', err);
      }
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingTodo(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="static" sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Typography 
            variant="h6" 
            component="h1" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              fontWeight: 'bold'
            }}
          >
           {isMobile ? 'Todo App' : 'Spring Boot Todo App'}
          </Typography>
          {!isMobile && (
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Backend: {import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Statistics */}
        <Box sx={{ mb: 4 }}>
          <TodoStatsComponent stats={stats} loading={loading} />
        </Box>

        {/* Search and Filter Bar */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 4,
            width: '100%',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, sm: 3 },
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            <Box sx={{ flex: { xs: 1, md: 2 } }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth variant="outlined" size={isMobile ? 'small' : 'medium'}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth variant="outlined" size={isMobile ? 'small' : 'medium'}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>

        {/* Todos List */}
        <Box sx={{ mb: 4, width: '100%' }}>
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: { xs: 2, sm: 0 },
              mb: 3,
            }}
          >
            <Typography 
              variant="h5" 
              component="h2"
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Todos ({filteredTodos.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setFormOpen(true)}
              size={isMobile ? 'small' : 'medium'}
              sx={{ 
                minWidth: { xs: '100%', sm: 'auto' },
                alignSelf: { xs: 'stretch', sm: 'auto' }
              }}
            >
              Add Todo
            </Button>
          </Box>

          {loading ? (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                py: { xs: 3, sm: 4, md: 6 }
              }}
            >
              <CircularProgress />
            </Box>
          ) : filteredTodos.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: { xs: 4, sm: 5, md: 6 },
                px: { xs: 2, sm: 4 }
              }}
            >
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {todos.length === 0 ? 'No todos yet!' : 'No todos match your filters'}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {todos.length === 0 ? 'Create your first todo to get started.' : 'Try adjusting your search or filters.'}
              </Typography>
              {todos.length === 0 && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setFormOpen(true)}
                  size={isMobile ? 'small' : 'medium'}
                >
                  Create Your First Todo
                </Button>
              )}
            </Box>
          ) : (
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: { xs: 2, sm: 3 },
                width: '100%',
              }}
            >
              {filteredTodos.map((todo) => (
                <Box key={todo.id}>
                  <TodoCard
                    todo={todo}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                    onToggle={handleToggleTodo}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          size={isMobile ? 'medium' : 'large'}
          sx={{ 
            position: 'fixed', 
            bottom: { xs: 16, sm: 24 }, 
            right: { xs: 16, sm: 24 },
            zIndex: 1000,
          }}
          onClick={() => setFormOpen(true)}
        >
          <Add />
        </Fab>

        {/* Todo Form Dialog */}
        <TodoForm
          open={formOpen}
          onClose={handleFormClose}
          onSubmit={editingTodo ? 
            (todoData) => handleUpdateTodo(todoData as UpdateTodoRequest) : 
            (todoData) => handleCreateTodo(todoData as CreateTodoRequest)
          }
          todo={editingTodo || undefined}
          isEdit={!!editingTodo}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;

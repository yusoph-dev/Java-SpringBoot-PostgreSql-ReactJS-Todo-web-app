import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import type { CreateTodoRequest, UpdateTodoRequest, Todo } from '../api/todoApi';

interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (todo: CreateTodoRequest | UpdateTodoRequest) => void;
  todo?: Todo;
  isEdit?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  todo, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    priority: todo?.priority || 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    completed: todo?.completed || false,
    dueDate: todo?.dueDate ? todo.dueDate.split('T')[0] : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const todoData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      ...(isEdit && { completed: formData.completed }),
    };

    onSubmit(todoData);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      completed: false,
      dueDate: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
    if (todo && isEdit) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'MEDIUM',
        completed: todo.completed || false,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      });
    }
  }, [todo, isEdit]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="h2">
          {isEdit ? 'Edit Todo' : 'Create New Todo'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ 
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr'
            }
          }}>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                autoFocus
                required
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                variant="outlined"
              />
            </Box>
            
            <Box>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <TextField
                fullWidth
                type="date"
                label="Due Date (Optional)"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            
            {isEdit && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.completed ? 'completed' : 'pending'}
                    onChange={(e) => handleChange('completed', e.target.value === 'completed')}
                    label="Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions className="p-3">
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!formData.title.trim()}
          >
            {isEdit ? 'Update Todo' : 'Create Todo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TodoForm;
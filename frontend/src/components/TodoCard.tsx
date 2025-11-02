import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Edit,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
  Schedule,
} from '@mui/icons-material';
import type { Todo } from '../api/todoApi';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onEdit, onDelete, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string | null | undefined) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !todo.completed;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: todo.completed ? 0.7 : 1,
        borderLeft: todo.completed ? '4px solid #4caf50' : isOverdue(todo.dueDate) ? '4px solid #f44336' : 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'flex-start' },
            mb: 2,
            gap: { xs: 1, sm: 2 }
          }}
        >
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? 'text.secondary' : 'text.primary',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              fontWeight: 'bold',
              flex: 1,
              wordBreak: 'break-word',
              lineHeight: 1.3,
            }}
          >
            {todo.title}
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1,
              flexWrap: 'wrap',
              alignSelf: { xs: 'flex-start', sm: 'flex-start' }
            }}
          >
            <Chip 
              label={todo.priority} 
              color={getPriorityColor(todo.priority) as any}
              size={isMobile ? 'small' : 'small'}
              sx={{ fontWeight: 'bold' }}
            />
            {todo.completed && (
              <Chip 
                label="✓ Done" 
                color="success" 
                size={isMobile ? 'small' : 'small'}
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {todo.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              textDecoration: todo.completed ? 'line-through' : 'none',
              mb: 2,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {todo.description}
          </Typography>
        )}

        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 0 },
            mt: 'auto'
          }}
        >
          <Box sx={{ order: { xs: 2, sm: 1 } }}>
            {todo.dueDate && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  mb: { xs: 0.5, sm: 0 }
                }}
              >
                <Schedule 
                  fontSize="small" 
                  color={isOverdue(todo.dueDate) ? 'error' : 'action'} 
                />
                <Typography 
                  variant="caption" 
                  color={isOverdue(todo.dueDate) ? 'error' : 'text.secondary'}
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    fontWeight: isOverdue(todo.dueDate) ? 'bold' : 'normal'
                  }}
                >
                  Due: {formatDate(todo.dueDate)}
                  {isOverdue(todo.dueDate) && ' (Overdue)'}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              order: { xs: 1, sm: 2 }
            }}
          >
            Created: {formatDate(todo.createdAt)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions 
        sx={{ 
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={todo.completed ? 'Mark as Pending' : 'Mark as Complete'}>
            <IconButton
              onClick={() => onToggle(todo.id!)}
              color={todo.completed ? 'success' : 'default'}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '&:hover': {
                  backgroundColor: todo.completed ? 'success.light' : 'action.hover',
                },
              }}
            >
              {todo.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Edit Todo">
            <IconButton
              onClick={() => onEdit(todo)}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                },
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Delete Todo">
          <IconButton
            onClick={() => onDelete(todo.id!)}
            color="error"
            size={isMobile ? 'small' : 'medium'}
            sx={{
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white',
              },
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default TodoCard;
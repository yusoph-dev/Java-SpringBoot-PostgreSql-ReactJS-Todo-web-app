import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  Assignment,
  CheckCircle,
  PendingActions,
  PriorityHigh,
} from '@mui/icons-material';
import type { TodoStats } from '../api/todoApi';

interface TodoStatsProps {
  stats: TodoStats | null;
  loading?: boolean;
}

const TodoStatsComponent: React.FC<TodoStatsProps> = ({ stats, loading = false }) => {

  if (loading || !stats) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Loading Statistics...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <Card sx={{ mb: 4, bgcolor: 'grey.50' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          color="primary"
          sx={{ 
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 'bold',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          📊 Todo Statistics
        </Typography>
        
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, sm: 3 },
            mt: 2
          }}
        >
          <Box sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
            <Assignment 
              color="primary" 
              sx={{ 
                fontSize: { xs: 30, sm: 40 }, 
                mb: 1 
              }} 
            />
            <Typography 
              variant="h4" 
              color="primary"
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
            >
              {stats.total}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Total Tasks
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
            <CheckCircle 
              color="success" 
              sx={{ 
                fontSize: { xs: 30, sm: 40 }, 
                mb: 1 
              }} 
            />
            <Typography 
              variant="h4" 
              color="success.main"
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
            >
              {stats.completed}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Completed
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
            <PendingActions 
              color="warning" 
              sx={{ 
                fontSize: { xs: 30, sm: 40 }, 
                mb: 1 
              }} 
            />
            <Typography 
              variant="h4" 
              color="warning.main"
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
            >
              {stats.pending}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Pending
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
            <PriorityHigh 
              color="error" 
              sx={{ 
                fontSize: { xs: 30, sm: 40 }, 
                mb: 1 
              }} 
            />
            <Typography 
              variant="h4" 
              color="error.main"
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
            >
              {stats.highPriority || 0}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              High Priority
            </Typography>
          </Box>
        </Box>

        <Box 
          sx={{ 
            mt: 3, 
            p: { xs: 2, sm: 3 }, 
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Completion Rate
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 2 }
            }}
          >
            <Box 
              sx={{ 
                width: '100%', 
                height: { xs: 8, sm: 10 }, 
                backgroundColor: '#e0e0e0', 
                borderRadius: 5,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${completionRate}%`,
                  height: '100%',
                  backgroundColor: completionRate >= 70 ? '#4caf50' : completionRate >= 40 ? '#ff9800' : '#f44336',
                  transition: 'width 0.3s ease'
                }}
              />
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                minWidth: 'fit-content',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 'bold'
              }}
            >
              {completionRate}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Priority Distribution: 
            <Box 
              component="span" 
              sx={{ color: 'error.main', fontWeight: 'bold' }}
            >
              {' '}High ({stats.highPriority || 0})
            </Box>
            {' • '}
            <Box 
              component="span" 
              sx={{ color: 'warning.main', fontWeight: 'bold' }}
            >
              Medium ({stats.mediumPriority || 0})
            </Box>
            {' • '}
            <Box 
              component="span" 
              sx={{ color: 'success.main', fontWeight: 'bold' }}
            >
              Low ({stats.lowPriority || 0})
            </Box>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodoStatsComponent;
import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

export function ValidationResults({ results }) {
  return (
    <Box>
      <Typography variant="h6">Validation Results</Typography>
      
      <Box sx={{ my: 2 }}>
        <Typography>Overall Accuracy: {results.accuracy.toFixed(2)}%</Typography>
        <LinearProgress 
          variant="determinate" 
          value={results.accuracy} 
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography>Role Accuracy: {results.roleAccuracy.toFixed(2)}%</Typography>
        <LinearProgress 
          variant="determinate" 
          value={results.roleAccuracy} 
          color="success"
        />
      </Box>

      {/* Add more metrics */}
    </Box>
  );
} 
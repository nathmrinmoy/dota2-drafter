import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { DraftContextProvider } from './context/DraftContext';
import DraftingBoard from './components/DraftingBoard';
import { EnhancedDashboard } from './components/ErrorMonitoring/EnhancedDashboard';
import { metricsService } from './services/metricsService';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Radiance, Arial, sans-serif',
    h1: {
      fontFamily: 'Reaver, serif'
    },
    h2: {
      fontFamily: 'Reaver, serif'
    },
    h3: {
      fontFamily: 'Reaver, serif'
    }
  }
});

function App() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(metricsService.getMetrics());
    };

    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <DraftContextProvider>
        <DraftingBoard />
        {metrics && <EnhancedDashboard metrics={metrics} />}
      </DraftContextProvider>
    </ThemeProvider>
  );
}

export default App;

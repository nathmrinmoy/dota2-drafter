import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { DraftContextProvider } from './context/DraftContext';
import DraftingBoard from './components/DraftingBoard';

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
  return (
    <ThemeProvider theme={darkTheme}>
      <DraftContextProvider>
        <DraftingBoard />
      </DraftContextProvider>
    </ThemeProvider>
  );
}

export default App;

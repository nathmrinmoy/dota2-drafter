import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DraftContextProvider } from './context/DraftContext';
import DraftingBoard from './components/DraftingBoard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: 'GrayText'
    }
  },
  typography: {
    fontFamily: 'Radiance, Arial, sans-serif',
    h1: { fontFamily: 'Reaver, serif' },
    h2: { fontFamily: 'Reaver, serif' },
    h3: { fontFamily: 'Reaver, serif' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          colorScheme: 'dark light'
        },
        body: {
          backgroundColor: '#121212',
          color: '#ffffff'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '@media (forced-colors: active)': {
            border: '1px solid currentColor'
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DraftContextProvider>
        <DraftingBoard />
      </DraftContextProvider>
    </ThemeProvider>
  );
}

export default App;

// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Main primary color (blue)
    },
    secondary: {
      main: '#ff4081', // Secondary color (pink)
    },
    background: {
      default: '#f4f6f9', // Background color for your app
    },
    text: {
      primary: '#333333', // Primary text color (dark gray)
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button: {
      textTransform: 'none', // Disable uppercase text for buttons
      fontSize: '1rem', // Set button font size
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Custom button border radius
          padding: '12px 24px', // Adjust button padding
        },
      },
    },
  },
});

export default theme;

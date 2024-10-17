import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Import the main App component
import { AuthProvider } from './contexts/AuthContext'; // Import authentication context
import { ThemeProvider } from '@mui/material/styles'; // Material-UI Theme Provider
import theme from './theme'; // Custom Material-UI theme
import reportWebVitals from './reportWebVitals'; // Performance metrics

// Find the root element in the HTML to mount the React app
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/* Wrap the app in AuthProvider for authentication management */}
      <AuthProvider>
        {/* Apply the custom Material-UI theme globally */}
        <ThemeProvider theme={theme}>
          <App /> {/* Main App component */}
        </ThemeProvider>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  // If the root element is not found, log an error
  console.error('Root element not found');
}

// Optionally log performance metrics (can be used for analytics or monitoring)
reportWebVitals(console.log);

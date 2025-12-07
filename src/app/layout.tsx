'use client';

import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { store } from '@/store';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Finance Dashboard</title>
        <meta name="description" content="Connect to APIs and build your custom dashboard" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Provider store={store}>
          <ThemeProvider>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}

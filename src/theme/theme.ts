import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00bfa5', // Teal/cyan accent
            light: '#5df2d6',
            dark: '#008e76',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#1e3a5f',
            light: '#2d5a8f',
            dark: '#0f1f3f',
        },
        background: {
            default: '#0a1929', // Dark navy background
            paper: '#132f4c', // Slightly lighter for cards
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0bec5',
        },
        divider: '#1e3a5f',
        success: {
            main: '#00e676',
        },
        error: {
            main: '#ff5252',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.1rem',
        },
        body1: {
            fontSize: '0.95rem',
        },
        body2: {
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 6,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 191, 165, 0.3)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.12)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#00bfa5',
            light: '#5df2d6',
            dark: '#008e76',
        },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
        borderRadius: 8,
    },
});

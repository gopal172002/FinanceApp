'use client';

import { useSelector } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { RootState } from '@/store';
import { lightTheme, darkTheme } from '@/theme/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { mode } = useSelector((state: RootState) => state.theme);
    const theme = mode === 'dark' ? darkTheme : lightTheme;

    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

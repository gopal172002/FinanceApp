import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme, ThemeState } from '@/types';
import { loadFromStorage, saveToStorage } from '@/services/storage';

const STORAGE_KEY = 'finboard_theme';

const initialState: ThemeState = loadFromStorage(STORAGE_KEY) || {
    mode: 'light' as Theme,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.mode = action.payload;
            saveToStorage(STORAGE_KEY, state);

            // Update document class for Tailwind dark mode
            if (typeof window !== 'undefined') {
                if (action.payload === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        },
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            saveToStorage(STORAGE_KEY, state);

            // Update document class for Tailwind dark mode
            if (typeof window !== 'undefined') {
                if (state.mode === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;

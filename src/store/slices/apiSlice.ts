import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiState, CacheEntry } from '@/types';

const initialState: ApiState = {
    cache: {},
    loading: {},
    errors: {},
};

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {
        setCacheData: <T,>(
            state: ApiState,
            action: PayloadAction<{ key: string; data: T; expiresIn: number }>
        ) => {
            state.cache[action.payload.key] = {
                data: action.payload.data,
                timestamp: Date.now(),
                expiresIn: action.payload.expiresIn,
            };
        },
        setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
            state.loading[action.payload.key] = action.payload.loading;
        },
        setError: (state, action: PayloadAction<{ key: string; error: string | null }>) => {
            state.errors[action.payload.key] = action.payload.error;
        },
        clearCache: (state, action: PayloadAction<string>) => {
            delete state.cache[action.payload];
        },
        clearAllCache: (state) => {
            state.cache = {};
        },
    },
});

export const {
    setCacheData,
    setLoading,
    setError,
    clearCache,
    clearAllCache,
} = apiSlice.actions;

export default apiSlice.reducer;

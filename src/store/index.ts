import { configureStore } from '@reduxjs/toolkit';
import widgetReducer from './slices/widgetSlice';
import themeReducer from './slices/themeSlice';
import apiReducer from './slices/apiSlice';

export const store = configureStore({
    reducer: {
        widgets: widgetReducer,
        theme: themeReducer,
        api: apiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WidgetConfig, DashboardState } from '@/types';
import { loadFromStorage, saveToStorage } from '@/services/storage';

const STORAGE_KEY = 'finboard_dashboard';

const initialState: DashboardState = loadFromStorage(STORAGE_KEY) || {
    widgets: [],
    layout: [],
};

const widgetSlice = createSlice({
    name: 'widgets',
    initialState,
    reducers: {
        addWidget: (state, action: PayloadAction<WidgetConfig>) => {
            state.widgets.push(action.payload);
            state.layout.push(action.payload.id);
            saveToStorage(STORAGE_KEY, state);
        },
        removeWidget: (state, action: PayloadAction<string>) => {
            state.widgets = state.widgets.filter(w => w.id !== action.payload);
            state.layout = state.layout.filter(id => id !== action.payload);
            saveToStorage(STORAGE_KEY, state);
        },
        updateWidget: (state, action: PayloadAction<WidgetConfig>) => {
            const index = state.widgets.findIndex(w => w.id === action.payload.id);
            if (index !== -1) {
                state.widgets[index] = action.payload;
                saveToStorage(STORAGE_KEY, state);
            }
        },
        reorderWidgets: (state, action: PayloadAction<string[]>) => {
            state.layout = action.payload;
            saveToStorage(STORAGE_KEY, state);
        },
        importDashboard: (state, action: PayloadAction<DashboardState>) => {
            state.widgets = action.payload.widgets;
            state.layout = action.payload.layout;
            saveToStorage(STORAGE_KEY, state);
        },
        clearDashboard: (state) => {
            state.widgets = [];
            state.layout = [];
            saveToStorage(STORAGE_KEY, state);
        },
    },
});

export const {
    addWidget,
    removeWidget,
    updateWidget,
    reorderWidgets,
    importDashboard,
    clearDashboard,
} = widgetSlice.actions;

export default widgetSlice.reducer;

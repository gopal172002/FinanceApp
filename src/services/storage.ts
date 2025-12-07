export const loadFromStorage = <T,>(key: string): T | null => {
    if (typeof window === 'undefined') return null;

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error loading from storage (${key}):`, error);
        return null;
    }
};

export const saveToStorage = <T,>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to storage (${key}):`, error);
    }
};

export const removeFromStorage = (key: string): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing from storage (${key}):`, error);
    }
};

export const clearStorage = (): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing storage:', error);
    }
};

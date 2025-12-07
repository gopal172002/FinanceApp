export const isValidSymbol = (symbol: string): boolean => {
    return /^[A-Z]{1,5}$/.test(symbol.toUpperCase());
};

export const isValidNumber = (value: any): boolean => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const sanitizeSymbol = (symbol: string): string => {
    return symbol.toUpperCase().trim();
};

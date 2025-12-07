export const formatCurrency = (value: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export const formatPercent = (value: number, decimals: number = 2): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};

export const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) {
        return `${(value / 1e12).toFixed(2)}T`;
    }
    if (value >= 1e9) {
        return `${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
        return `${(value / 1e6).toFixed(2)}M`;
    }
    if (value >= 1e3) {
        return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toFixed(2);
};

export const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDateTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

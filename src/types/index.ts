// Widget Types
export type WidgetType = 'stock-table' | 'finance-card' | 'chart' | 'generic';

export type ChartType = 'candlestick' | 'line';

export type TimeInterval = '1D' | '1W' | '1M' | '3M' | '1Y';

export type FinanceCardType = 'watchlist' | 'gainers' | 'losers' | 'performance';

// Widget Configuration
export interface BaseWidgetConfig {
    id: string;
    type: WidgetType;
    title: string;
    position: number;
    refreshInterval: number; // in seconds
    useRealtime?: boolean; // Enable WebSocket real-time updates
}

export interface StockTableConfig extends BaseWidgetConfig {
    type: 'stock-table';
    symbols: string[];
    columns: string[];
    pageSize: number;
}

export interface FinanceCardConfig extends BaseWidgetConfig {
    type: 'finance-card';
    cardType: FinanceCardType;
    symbols: string[];
    displayFields: string[];
}

export interface ChartWidgetConfig extends BaseWidgetConfig {
    type: 'chart';
    symbol: string;
    chartType: ChartType;
    interval: TimeInterval;
}

export interface GenericWidgetConfig extends BaseWidgetConfig {
    type: 'generic';
    apiUrl: string;
    selectedFields: string[];
    displayMode: 'table' | 'card' | 'chart';
    fieldLabels?: Record<string, string>; // Custom labels for fields
}

export type WidgetConfig = StockTableConfig | FinanceCardConfig | ChartWidgetConfig | GenericWidgetConfig;

// API Response Types
export interface StockQuote {
    c: number; // Current price
    d: number; // Change
    dp: number; // Percent change
    h: number; // High price of the day
    l: number; // Low price of the day
    o: number; // Open price of the day
    pc: number; // Previous close price
    t: number; // Timestamp
}

export interface CompanyProfile {
    country: string;
    currency: string;
    exchange: string;
    ipo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
    logo: string;
    finnhubIndustry: string;
}

export interface CandleData {
    c: number[]; // Close prices
    h: number[]; // High prices
    l: number[]; // Low prices
    o: number[]; // Open prices
    s: string; // Status
    t: number[]; // Timestamps
    v: number[]; // Volumes
}

export interface MarketData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    volume?: number;
    marketCap?: number;
    name?: string;
}

// Dashboard State
export interface DashboardState {
    widgets: WidgetConfig[];
    layout: string[];
}

// Theme
export type Theme = 'light' | 'dark';

export interface ThemeState {
    mode: Theme;
}

// API Cache
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresIn: number;
}

export interface ApiState {
    cache: Record<string, CacheEntry<any>>;
    loading: Record<string, boolean>;
    errors: Record<string, string | null>;
}

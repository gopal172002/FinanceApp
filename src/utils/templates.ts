import { WidgetConfig } from '@/types';

export interface DashboardTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    widgets: any[]; // Simplified to avoid complex union type issues
}

export const dashboardTemplates: DashboardTemplate[] = [
    {
        id: 'crypto-rates',
        name: 'Crypto Exchange Rates',
        description: 'Track Bitcoin exchange rates across multiple currencies',
        icon: '₿',
        widgets: [
            {
                type: 'generic',
                title: 'Bitcoin Exchange Rates',
                apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
                selectedFields: ['data.currency', 'data.rates.USD', 'data.rates.EUR', 'data.rates.GBP', 'data.rates.JPY'],
                displayMode: 'table',
                refreshInterval: 60,
                position: 0,
            },
            {
                type: 'generic',
                title: 'BTC Price Cards',
                apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
                selectedFields: ['data.rates.USD', 'data.rates.EUR', 'data.rates.GBP'],
                displayMode: 'card',
                refreshInterval: 60,
                position: 1,
            },
        ],
    },
    {
        id: 'eth-rates',
        name: 'Ethereum Tracker',
        description: 'Monitor Ethereum prices in different currencies',
        icon: '⟠',
        widgets: [
            {
                type: 'generic',
                title: 'Ethereum Exchange Rates',
                apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH',
                selectedFields: ['data.rates.USD', 'data.rates.EUR', 'data.rates.BTC'],
                displayMode: 'chart',
                refreshInterval: 60,
                position: 0,
            },
            {
                type: 'generic',
                title: 'ETH Price Overview',
                apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH',
                selectedFields: ['data.rates.USD', 'data.rates.EUR'],
                displayMode: 'card',
                refreshInterval: 60,
                position: 1,
            },
        ],
    },
    {
        id: 'multi-crypto',
        name: 'Multi-Crypto Dashboard',
        description: 'Compare Bitcoin and Ethereum side by side',
        icon: '💰',
        widgets: [
            {
                type: 'generic',
                title: 'Bitcoin Rates',
                apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
                selectedFields: ['data.rates.USD', 'data.rates.EUR', 'data.rates.GBP'],
                displayMode: 'card',
                refreshInterval: 60,
                position: 0,
            },
            {
                type: 'generic',
                title: 'Ethereum Rates',
                apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH',
                selectedFields: ['data.rates.USD', 'data.rates.EUR', 'data.rates.GBP'],
                displayMode: 'card',
                refreshInterval: 60,
                position: 1,
            },
            {
                type: 'generic',
                title: 'BTC Full Data',
                apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
                selectedFields: ['data.currency', 'data.rates.USD', 'data.rates.EUR', 'data.rates.GBP', 'data.rates.JPY', 'data.rates.CNY'],
                displayMode: 'table',
                refreshInterval: 60,
                position: 2,
            },
        ],
    },
    {
        id: 'custom-api',
        name: 'Custom API Example',
        description: 'Example showing how to use any API endpoint',
        icon: '🔌',
        widgets: [
            {
                type: 'generic',
                title: 'API Data Example',
                apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
                selectedFields: ['data.rates.USD', 'data.rates.EUR'],
                displayMode: 'chart',
                refreshInterval: 30,
                position: 0,
            },
        ],
    },
];

export const getTemplateById = (id: string): DashboardTemplate | undefined => {
    return dashboardTemplates.find(template => template.id === id);
};

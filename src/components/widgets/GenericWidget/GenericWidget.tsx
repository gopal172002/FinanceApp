'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Skeleton,
    Chip,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BaseWidget } from '../BaseWidget';
import { GenericWidgetConfig } from '@/types';
import { fetchGenericAPI, extractFieldPaths, getNestedValue, formatValue, isNumeric } from '@/services/api/generic';
import { cachedFetch } from '@/services/api/cache';

interface GenericWidgetProps {
    config: GenericWidgetConfig;
    onRemove: () => void;
    onConfigure?: () => void;
}

export const GenericWidget: React.FC<GenericWidgetProps> = ({
    config,
    onRemove,
    onConfigure,
}) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const apiData = await cachedFetch(
                `generic-${config.apiUrl}`,
                () => fetchGenericAPI(config.apiUrl),
                config.refreshInterval * 1000
            );

            setData(apiData);
            setLastUpdated(new Date());
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, config.refreshInterval * 1000);
        return () => clearInterval(interval);
    }, [config.apiUrl, config.refreshInterval]);

    const renderTableMode = () => {
        if (!data) return null;

        return (
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {config.selectedFields.map((field) => {
                            const value = getNestedValue(data, field);
                            const label = config.fieldLabels?.[field] || field;

                            return (
                                <TableRow
                                    key={field}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                                        },
                                    }}
                                >
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {label}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatValue(value)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderCardMode = () => {
        if (!data) return null;

        return (
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 2,
                }}
            >
                {config.selectedFields.map((field) => {
                    const value = getNestedValue(data, field);
                    const label = config.fieldLabels?.[field] || field;

                    return (
                        <Box
                            key={field}
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                {label}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {formatValue(value)}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    const renderChartMode = () => {
        if (!data) return null;

        // Prepare chart data from selected fields
        const chartData = config.selectedFields.map(field => {
            const value = getNestedValue(data, field);
            const label = config.fieldLabels?.[field] || field.split('.').pop() || field;

            return {
                name: label,
                value: isNumeric(value) ? parseFloat(value) : 0,
            };
        }).filter(item => item.value > 0);

        if (chartData.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No numeric data available for chart
                </Typography>
            );
        }

        return (
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="name"
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#00bfa5"
                        strokeWidth={2}
                        dot={{ fill: '#00bfa5', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Box>
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} height={60} sx={{ mb: 1 }} />
                    ))}
                </Box>
            );
        }

        if (error) {
            return (
                <Typography color="error" align="center" sx={{ py: 4 }}>
                    {error}
                </Typography>
            );
        }

        if (!data) {
            return (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No data available
                </Typography>
            );
        }

        switch (config.displayMode) {
            case 'table':
                return renderTableMode();
            case 'card':
                return renderCardMode();
            case 'chart':
                return renderChartMode();
            default:
                return renderTableMode();
        }
    };

    return (
        <BaseWidget
            id={config.id}
            title={config.title}
            subtitle={`${config.selectedFields.length} fields`}
            onRemove={onRemove}
            onConfigure={onConfigure}
            onRefresh={fetchData}
        >
            <Box>
                {renderContent()}

                {!loading && !error && data && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </Typography>
                        <Chip
                            label="Custom API"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(0, 191, 165, 0.1)',
                                color: 'primary.main',
                                fontWeight: 500,
                            }}
                        />
                    </Box>
                )}
            </Box>
        </BaseWidget>
    );
};

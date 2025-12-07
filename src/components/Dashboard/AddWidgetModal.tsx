'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
    Alert,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Close as CloseIcon,
    TableChart,
    CreditCard as CardIcon,
    ShowChart,
    CheckCircle,
    Error as ErrorIcon,
} from '@mui/icons-material';
import { fetchGenericAPI, extractFieldPaths, getFieldInfo } from '@/services/api/generic';

interface AddWidgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (config: any) => void;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
    isOpen,
    onClose,
    onAdd,
}) => {
    // Form state
    const [widgetName, setWidgetName] = useState('');
    const [apiUrl, setApiUrl] = useState('');
    const [refreshInterval, setRefreshInterval] = useState('30');
    const [displayMode, setDisplayMode] = useState<'table' | 'card' | 'chart'>('table');

    // API testing state
    const [isTestingApi, setIsTestingApi] = useState(false);
    const [apiTestSuccess, setApiTestSuccess] = useState(false);
    const [apiTestError, setApiTestError] = useState<string | null>(null);
    const [availableFields, setAvailableFields] = useState<string[]>([]);
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [apiResponse, setApiResponse] = useState<any>(null);

    // Enhanced features state
    const [searchQuery, setSearchQuery] = useState('');
    const [showArraysOnly, setShowArraysOnly] = useState(false);
    const [fieldLabels, setFieldLabels] = useState<Record<string, string>>({});

    const handleTestApi = async () => {
        if (!apiUrl.trim()) {
            setApiTestError('Please enter an API URL');
            return;
        }

        setIsTestingApi(true);
        setApiTestError(null);
        setApiTestSuccess(false);

        try {
            // Fetch data from the API
            const data = await fetchGenericAPI(apiUrl);
            setApiResponse(data);

            // Extract all field paths from the response
            const fields = extractFieldPaths(data);
            setAvailableFields(fields);
            setApiTestSuccess(true);
            setApiTestError(null);
        } catch (error: any) {
            setApiTestError(error.message || 'Failed to fetch API data');
            setApiTestSuccess(false);
            setAvailableFields([]);
        } finally {
            setIsTestingApi(false);
        }
    };

    const handleFieldToggle = (field: string) => {
        setSelectedFields(prev =>
            prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiUrl.trim()) {
            setApiTestError('Please enter an API URL');
            return;
        }

        if (selectedFields.length === 0) {
            setApiTestError('Please select at least one field to display');
            return;
        }

        const config = {
            id: `widget-${Date.now()}`,
            type: 'generic',
            title: widgetName || 'Custom API Widget',
            apiUrl: apiUrl.trim(),
            selectedFields,
            displayMode,
            refreshInterval: parseInt(refreshInterval),
            fieldLabels, // Include custom field labels
            position: 0,
        };

        onAdd(config);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setWidgetName('');
        setApiUrl('');
        setRefreshInterval('30');
        setDisplayMode('table');
        setIsTestingApi(false);
        setApiTestSuccess(false);
        setApiTestError(null);
        setAvailableFields([]);
        setSelectedFields([]);
        setApiResponse(null);
        setSearchQuery('');
        setShowArraysOnly(false);
        setFieldLabels({});
    };

    // Filter available fields based on search and array filter
    const filteredFields = availableFields.filter(field => {
        // Search filter
        if (searchQuery && !field.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Array-only filter
        if (showArraysOnly && !field.includes('[0]')) {
            return false;
        }

        return true;
    });

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    backgroundImage: 'none',
                },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Add Custom API Widget
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Connect to any financial API and select fields to display
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    {/* Widget Name */}
                    <TextField
                        fullWidth
                        label="Widget Name"
                        placeholder="e.g., Bitcoin Exchange Rates"
                        value={widgetName}
                        onChange={(e) => setWidgetName(e.target.value)}
                        sx={{ mb: 3 }}
                        helperText="Give your widget a descriptive name"
                    />

                    {/* API URL */}
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="API URL"
                            placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            helperText="Enter the full API endpoint URL"
                            InputProps={{
                                endAdornment: (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleTestApi}
                                        disabled={isTestingApi || !apiUrl.trim()}
                                        sx={{ ml: 1, minWidth: 80 }}
                                    >
                                        {isTestingApi ? <CircularProgress size={20} /> : 'Test'}
                                    </Button>
                                ),
                            }}
                        />

                        {/* API Test Result */}
                        {apiTestSuccess && (
                            <Alert
                                icon={<CheckCircle fontSize="inherit" />}
                                severity="success"
                                sx={{ mt: 1 }}
                            >
                                API connection successful! Found {availableFields.length} fields.
                            </Alert>
                        )}

                        {apiTestError && (
                            <Alert
                                icon={<ErrorIcon fontSize="inherit" />}
                                severity="error"
                                sx={{ mt: 1 }}
                            >
                                {apiTestError}
                            </Alert>
                        )}
                    </Box>

                    {/* Display Available Fields Only After Successful Test */}
                    {apiTestSuccess && availableFields.length > 0 && (
                        <>
                            {/* Display Mode */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                                    Display Mode
                                </Typography>
                                <ToggleButtonGroup
                                    value={displayMode}
                                    exclusive
                                    onChange={(e, newMode) => newMode && setDisplayMode(newMode)}
                                    fullWidth
                                    size="small"
                                >
                                    <ToggleButton value="table">
                                        <TableChart sx={{ mr: 1, fontSize: 18 }} />
                                        Table
                                    </ToggleButton>
                                    <ToggleButton value="card">
                                        <CardIcon sx={{ mr: 1, fontSize: 18 }} />
                                        Cards
                                    </ToggleButton>
                                    <ToggleButton value="chart">
                                        <ShowChart sx={{ mr: 1, fontSize: 18 }} />
                                        Chart
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {/* Refresh Interval */}
                            <TextField
                                fullWidth
                                label="Refresh Interval (seconds)"
                                type="number"
                                value={refreshInterval}
                                onChange={(e) => setRefreshInterval(e.target.value)}
                                sx={{ mb: 3 }}
                                inputProps={{ min: 10 }}
                            />

                            {/* Available Fields */}
                            <Box>
                                <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                                    Select Fields to Display
                                </Typography>

                                {/* Search Fields */}
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search for fields..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={{ mb: 1.5 }}
                                />

                                {/* Show Arrays Only Checkbox */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showArraysOnly}
                                            onChange={(e) => setShowArraysOnly(e.target.checked)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Show arrays only (for table view)
                                        </Typography>
                                    }
                                    sx={{ mb: 1.5 }}
                                />

                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                                    Available Fields ({filteredFields.length})
                                </Typography>

                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        maxHeight: 300,
                                        overflowY: 'auto',
                                    }}
                                >
                                    <List disablePadding>
                                        {filteredFields.map((field) => {
                                            const fieldInfo = getFieldInfo(field, apiResponse);
                                            return (
                                                <ListItem key={field} disablePadding>
                                                    <ListItemButton
                                                        onClick={() => handleFieldToggle(field)}
                                                        dense
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={selectedFields.includes(field)}
                                                                tabIndex={-1}
                                                                disableRipple
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontFamily: 'monospace',
                                                                        fontSize: '0.85rem',
                                                                    }}
                                                                >
                                                                    {field}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                    {fieldInfo.type} | {fieldInfo.sample}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Box>
                            </Box>

                            {/* Selected Fields Preview */}
                            {selectedFields.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                                        Selected Fields
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selectedFields.map((field) => (
                                            <Chip
                                                key={field}
                                                label={field}
                                                onDelete={() => handleFieldToggle(field)}
                                                size="small"
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.75rem',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!apiTestSuccess || selectedFields.length === 0}
                >
                    Add Widget
                </Button>
            </DialogActions>
        </Dialog>
    );
};

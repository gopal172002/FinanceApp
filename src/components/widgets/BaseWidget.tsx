'use client';

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Box,
    Typography,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    MoreVert,
    DragIndicator,
    Refresh,
    Settings,
    Delete,
} from '@mui/icons-material';

interface BaseWidgetProps {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onRemove: () => void;
    onConfigure?: () => void;
    onRefresh?: () => void;
    isDragging?: boolean;
}

export const BaseWidget: React.FC<BaseWidgetProps> = ({
    id,
    title,
    subtitle,
    children,
    onRemove,
    onConfigure,
    onRefresh,
    isDragging = false,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleRefresh = () => {
        onRefresh?.();
        handleMenuClose();
    };

    const handleConfigure = () => {
        onConfigure?.();
        handleMenuClose();
    };

    const handleDelete = () => {
        onRemove();
        handleMenuClose();
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 191, 165, 0.15)',
                },
            }}
        >
            <CardHeader
                avatar={
                    <DragIndicator
                        sx={{
                            color: 'text.secondary',
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' },
                        }}
                    />
                }
                action={
                    <>
                        <IconButton size="small" onClick={handleMenuOpen}>
                            <MoreVert />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {onRefresh && (
                                <MenuItem onClick={handleRefresh}>
                                    <Refresh sx={{ mr: 1, fontSize: 20 }} />
                                    Refresh
                                </MenuItem>
                            )}
                            {onConfigure && (
                                <MenuItem onClick={handleConfigure}>
                                    <Settings sx={{ mr: 1, fontSize: 20 }} />
                                    Configure
                                </MenuItem>
                            )}
                            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                                <Delete sx={{ mr: 1, fontSize: 20 }} />
                                Delete
                            </MenuItem>
                        </Menu>
                    </>
                }
                title={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                }
                subheader={subtitle}
                sx={{ pb: 1 }}
            />
            <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                {children}
            </CardContent>
        </Card>
    );
};

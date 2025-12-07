'use client';

import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { RootState } from '@/store';
import { removeWidget, reorderWidgets } from '@/store/slices/widgetSlice';
import { GenericWidget } from '@/components/widgets/GenericWidget/GenericWidget';

interface DashboardGridProps {
    onAddWidget?: () => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ onAddWidget }) => {
    const dispatch = useDispatch();
    const { widgets, layout } = useSelector((state: RootState) => state.widgets);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const newLayout = Array.from(layout);
        const [removed] = newLayout.splice(result.source.index, 1);
        newLayout.splice(result.destination.index, 0, removed);

        dispatch(reorderWidgets(newLayout));
    };

    const handleRemoveWidget = useCallback((id: string) => {
        dispatch(removeWidget(id));
    }, [dispatch]);

    const renderWidget = useCallback((widgetId: string) => {
        const widget = widgets.find(w => w.id === widgetId);
        if (!widget) return null;

        const commonProps = {
            config: widget,
            onRemove: () => handleRemoveWidget(widget.id),
        };

        // All widgets now use GenericWidget
        if (widget.type === 'generic') {
            return <GenericWidget {...commonProps} config={widget} />;
        }

        // Fallback for any old widget types in localStorage
        return (
            <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Typography color="warning.main">
                    Unsupported widget type: {widget.type}. Please remove and create a new widget.
                </Typography>
            </Paper>
        );
    }, [widgets, handleRemoveWidget]);

    if (widgets.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                    }}
                >
                    <AddIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Build Your Finance Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 500, mb: 3 }}>
                    Create custom widgets by connecting to any finance API. Track stocks, crypto, forex, or economic indicators with real-time data.
                </Typography>
            </Box>
        );
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="dashboard">
                {(provided) => (
                    <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(2, 1fr)',
                                lg: 'repeat(3, 1fr)',
                            },
                            gap: 3,
                        }}
                    >
                        {layout.map((widgetId, index) => (
                            <Draggable key={widgetId} draggableId={widgetId} index={index}>
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        sx={{
                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                            transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {renderWidget(widgetId)}
                                    </Box>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Add Widget Card */}
                        <Paper
                            sx={{
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed',
                                borderColor: 'primary.main',
                                bgcolor: 'rgba(0, 191, 165, 0.05)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 191, 165, 0.1)',
                                    borderColor: 'primary.light',
                                },
                            }}
                            onClick={onAddWidget}
                        >
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                }}
                            >
                                <AddIcon sx={{ fontSize: 32, color: 'white' }} />
                            </Box>
                            <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                                Add Widget
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                Connect to a finance API and create a custom widget
                            </Typography>
                        </Paper>
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    );
};

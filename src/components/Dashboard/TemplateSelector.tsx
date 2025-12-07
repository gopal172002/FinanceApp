'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
} from '@mui/material';
import {
    Close as CloseIcon,
    Computer,
    TrendingUp,
    CurrencyBitcoin,
    ShowChart,
} from '@mui/icons-material';
import { dashboardTemplates, DashboardTemplate } from '@/utils/templates';

interface TemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (templateId: string) => void;
}

const templateIcons: Record<string, React.ReactNode> = {
    'tech-giants': <Computer sx={{ fontSize: 48, color: 'primary.main' }} />,
    'market-overview': <TrendingUp sx={{ fontSize: 48, color: 'success.main' }} />,
    'crypto-watch': <CurrencyBitcoin sx={{ fontSize: 48, color: 'warning.main' }} />,
    'day-trader': <ShowChart sx={{ fontSize: 48, color: 'error.main' }} />,
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    isOpen,
    onClose,
    onSelectTemplate,
}) => {
    const handleSelectTemplate = (templateId: string) => {
        onSelectTemplate(templateId);
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="lg"
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
                            Choose a Dashboard Template
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Start with a pre-built template or create your own
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mt: 0.5 }}>
                    {dashboardTemplates.map((template) => (
                        <Box key={template.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-4px)',
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 2,
                                                bgcolor: 'rgba(0, 191, 165, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2,
                                            }}
                                        >
                                            {templateIcons[template.id]}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {template.name}
                                            </Typography>
                                            <Chip
                                                label={`${template.widgets.length} widgets`}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(0, 191, 165, 0.1)',
                                                    color: 'primary.main',
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                        {template.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {template.widgets.slice(0, 3).map((widget, idx) => (
                                            <Chip
                                                key={idx}
                                                label={widget.title}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                        {template.widgets.length > 3 && (
                                            <Chip
                                                label={`+${template.widgets.length - 3} more`}
                                                size="small"
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => handleSelectTemplate(template.id)}
                                    >
                                        Use Template
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ minWidth: 200 }}
                    >
                        Start from Scratch
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

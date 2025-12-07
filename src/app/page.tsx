'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Brightness4,
  Brightness7,
  Download,
  Upload,
  DeleteOutline,
  ShowChart,
} from '@mui/icons-material';
import { RootState } from '@/store';
import { addWidget, importDashboard, clearDashboard } from '@/store/slices/widgetSlice';
import { toggleTheme } from '@/store/slices/themeSlice';
import { DashboardGrid } from '@/components/Dashboard/DashboardGrid';
import { AddWidgetModal } from '@/components/Dashboard/AddWidgetModal';
import { TemplateSelector } from '@/components/Dashboard/TemplateSelector';
import { getTemplateById } from '@/utils/templates';

export default function HomePage() {
  const dispatch = useDispatch();
  const { widgets } = useSelector((state: RootState) => state.widgets);
  const { mode } = useSelector((state: RootState) => state.theme);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleAddWidget = (config: any) => {
    dispatch(addWidget(config));
  };

  const handleExport = () => {
    const dashboard = { widgets, layout: widgets.map(w => w.id) };
    const dataStr = JSON.stringify(dashboard, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          try {
            const dashboard = JSON.parse(event.target.result);
            dispatch(importDashboard(dashboard));
          } catch (error) {
            alert('Invalid dashboard file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all widgets?')) {
      dispatch(clearDashboard());
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      // Clear existing widgets
      dispatch(clearDashboard());

      // Add all widgets from template
      template.widgets.forEach((widgetConfig: any) => {
        dispatch(addWidget({
          ...widgetConfig,
          id: `widget-${Date.now()}-${Math.random()}`,
        }));
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ py: 1, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShowChart sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                Finance Dashboard
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Connect to APIs and build your custom dashboard
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
            {widgets.length > 0 && (
              <Chip
                label={`${widgets.length} active widget${widgets.length > 1 ? 's' : ''}`}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 191, 165, 0.1)',
                  color: 'primary.main',
                  fontWeight: 500,
                }}
                suppressHydrationWarning
              />
            )}

            <IconButton onClick={() => dispatch(toggleTheme())} size="small" suppressHydrationWarning>
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <IconButton onClick={handleExport} size="small" title="Export">
              <Download fontSize="small" />
            </IconButton>

            <IconButton onClick={handleImport} size="small" title="Import">
              <Upload fontSize="small" />
            </IconButton>

            <Button
              variant="outlined"
              onClick={() => setShowTemplateModal(true)}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Templates
            </Button>

            {widgets.length > 0 && (
              <IconButton onClick={handleClear} size="small" title="Clear All" color="error">
                <DeleteOutline fontSize="small" />
              </IconButton>
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddModal(true)}
              sx={{ ml: 1, textTransform: 'none' }}
            >
              Add Widget
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {widgets.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {widgets.length} active widget{widgets.length > 1 ? 's' : ''} • Real-time data
            </Typography>
          </Box>
        )}
        <DashboardGrid onAddWidget={() => setShowAddModal(true)} />
      </Container>

      {/* Add Widget Modal */}
      <AddWidgetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddWidget}
      />

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleLoadTemplate}
      />
    </Box>
  );
}

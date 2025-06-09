import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import CreateSample from './pages/CreateSample';
import ViewSample from './pages/ViewSample';
import SamplesList from './pages/SamplesList';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="samples">
            <Route index element={<SamplesList />} />
            <Route path="new" element={<CreateSample />} />
            <Route path=":styleId" element={<ViewSample />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App; 
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeContextProvider } from './contexts/ThemeContext';
import Layout from './components/layout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load route components
const HomePage = lazy(() => import('./pages/HomePage'));
const MaterialPage = lazy(() => import('./pages/MaterialPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SubmitPage = lazy(() => import('./pages/SubmitPage'));
const AuthorGraphPage = lazy(() => import('./pages/AuthorGraphPage'));
const VenuesPage = lazy(() => import('./pages/VenuesPage'));
const HistoricalPapersPage = lazy(() => import('./pages/HistoricalPapersPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * Loading fallback component for lazy-loaded routes
 */
const RouteLoader: React.FC = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
  >
    <CircularProgress />
  </Box>
);

/**
 * Root application component
 *
 * Features:
 * - Lazy loading for all routes
 * - Error boundary wrapping
 * - Theme context provider
 */
const App: React.FC = () => (
  <ThemeContextProvider>
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/material" element={<MaterialPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/authors" element={<AuthorGraphPage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/history" element={<HistoricalPapersPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  </ThemeContextProvider>
);

export default App;

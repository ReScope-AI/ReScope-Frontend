import SidebarLayout from '@/components/layouts/sidebar';
import DashboardPage from '@/pages/dashboard/dashboard-page';
import NotFoundPage from '@/pages/NotFound';
import SelectBoard from '@/pages/select-board/select-board';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Lazy-loaded components
const SprintsPage = React.lazy(() => import('@/pages/Retrospective/SprintsPage'));

export const AppRoutes = () => {
  const PageLoader = () => (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* Root route */}
      <Route
        path="/"
        element={
          <React.Suspense fallback={<PageLoader />}>
            <SprintsPage />
          </React.Suspense>
        }
      />

      {/* Sprints route */}
      <Route
        path="/sprints"
        element={
          <React.Suspense fallback={<PageLoader />}>
            <SprintsPage />
          </React.Suspense>
        }
      />

      {/* Dashboard route */}
      <Route
        path="/dashboard"
        element={
          <React.Suspense fallback={<PageLoader />}>
            <SidebarLayout>
              <DashboardPage />
            </SidebarLayout>
          </React.Suspense>
        }
      />

      {/* Select Board route */}
      <Route
        path="/select-board"
        element={
          <React.Suspense fallback={<PageLoader />}>
            <SelectBoard />
          </React.Suspense>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

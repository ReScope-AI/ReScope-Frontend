import { Route, Routes } from 'react-router';
import AppLayout from '@/components/layouts/app-layout';
import NotFoundPage from '@/pages/NotFound';
import React from 'react';

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
      <Route path="/">
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <React.Suspense fallback={<PageLoader />}>
                <SprintsPage />
              </React.Suspense>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

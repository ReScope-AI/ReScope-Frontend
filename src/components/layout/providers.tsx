'use client';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          {children}
        </ActiveThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

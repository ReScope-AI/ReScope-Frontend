'use client';
import { useTheme } from 'next-themes';
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
  const { resolvedTheme } = useTheme();

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

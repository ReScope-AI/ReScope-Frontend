import { cookies } from 'next/headers';

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import AuthLayout from '@/components/layout/auth-layout';
import Header from '@/components/layout/header';
import Providers from '@/components/layout/providers';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReScope - Dashboard',
  description: 'Manage your retrospectives and generate AI-powered insights'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  return (
    <Providers activeThemeValue={activeThemeValue as string}>
      <AuthLayout>
        <KBar>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
              <Header />
              {/* page main content */}
              {children}
              {/* page main content ends */}
            </SidebarInset>
          </SidebarProvider>
        </KBar>
      </AuthLayout>
    </Providers>
  );
}

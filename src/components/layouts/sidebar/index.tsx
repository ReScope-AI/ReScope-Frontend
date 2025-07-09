import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import { AppSidebar } from './app-sidebar';

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="w-full h-full flex flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SidebarLayout;

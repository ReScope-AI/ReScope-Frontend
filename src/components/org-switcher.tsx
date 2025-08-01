'use client';

import Image from 'next/image';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

export function OrgSwitcher() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <div
            className={`flex aspect-square ${open ? 'size-12' : 'size-8'} items-center justify-center rounded-lg`}
          >
            <Image
              src='/assets/logo-header.png'
              alt='logo'
              width={open ? 40 : 24}
              height={open ? 40 : 24}
              className='rounded-md object-contain'
            />
          </div>
          <div className='flex flex-col gap-0.5 leading-none'>
            <span className='font-semibold'>Re-Scope</span>
            <span className=''> Management</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

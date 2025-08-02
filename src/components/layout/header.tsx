'use client';

import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

import { useTaskStore } from '@/features/kanban/utils/store';
import { useRetroSessionStore } from '@/stores/retroSessionStore';

import SearchInput from '../search-input';
import { ThemeSelector } from '../theme-selector';

import { ModeToggle } from './ThemeToggle/theme-toggle';
import { UserNav } from './user-nav';

export default function Header() {
  const pathname = usePathname();
  const showSteps = pathname.includes('/dashboard/retrospective/');
  const { retroSession } = useRetroSessionStore();
  const step = useTaskStore((state) => state.step);
  const setStep = useTaskStore((state) => state.setStep);

  const initialSteps = [
    { id: 1, label: '1. Reflect' },
    { id: 2, label: '2. Discuss' },
    { id: 3, label: '3. Summary' }
  ];

  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 pt-2'>
        {showSteps && (
          <>
            <div className='flex items-center gap-2 overflow-x-auto p-2'>
              <div className='text-md font-semibold'>
                {new Date(
                  retroSession?.created_at as string
                ).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className='mx-2 h-4 w-0.5 bg-gray-200' />
              {initialSteps.map((stepItem, index) => (
                <React.Fragment key={stepItem.id}>
                  <div
                    className={`flex-shrink-0 cursor-pointer rounded-md px-2 py-2 text-sm font-semibold transition-colors duration-200 ${
                      index === step - 1
                        ? 'bg-green-700 text-white'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                    onClick={() => setStep(stepItem.id)}
                  >
                    {stepItem.label}
                  </div>
                  {index < initialSteps.length - 1 && (
                    <ChevronRight className='h-4 w-4 flex-shrink-0 text-gray-400' />
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>

      <div className='flex items-center gap-2 pt-2'>
        <SearchInput />
        <UserNav />
        <ModeToggle />
        <ThemeSelector />
      </div>
    </header>
  );
}

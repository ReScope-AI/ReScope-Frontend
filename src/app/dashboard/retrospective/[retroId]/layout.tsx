'use client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();

  return (
    <div className='flex-1 space-y-4 py-2'>
      <Heading title={`${params.retroId}`} />
      <Separator />
      {children}
    </div>
  );
};

export default Layout;

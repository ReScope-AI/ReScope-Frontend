'use client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getRetroSessionById } from '@/config/api/retro-session';
import { QUERY_CONSTANTS } from '@/constants/query';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { useQuery } from '@tanstack/react-query';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const { setRetroSession } = useRetroSessionStore();
  const retroId = params.retroId as string;

  const { data: retro, isLoading } = useQuery({
    queryKey: [QUERY_CONSTANTS.RETRO_SESSION.GET_RETRO_SESSION_BY_ID, retroId],
    queryFn: () => getRetroSessionById(retroId),
    enabled: !!retroId,
    gcTime: Infinity,
    staleTime: 0
  });

  useEffect(() => {
    if (retro && retro.code === 200) {
      setRetroSession(retro.data);
    }
  }, [retro, setRetroSession]);

  if (isLoading) {
    return <Skeleton className='h-10 w-full' />;
  }

  if (retro && retro.code !== 200) {
    notFound();
  }

  return (
    <div className='flex-1 space-y-4 py-2'>
      <Heading title={`${retro?.data?.name}`} />
      <Separator />
      {children}
    </div>
  );
};

export default Layout;

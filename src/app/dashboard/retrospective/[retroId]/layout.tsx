'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { getRetroSessionById } from '@/config/api/retro-session';
import { QUERY_CONSTANTS } from '@/constants/query';
import { usePollStore } from '@/stores/pollStore';
import { useRetroSocket } from '@/hooks/use-retro-socket';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { useQuery } from '@tanstack/react-query';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const { setRetroSession } = useRetroSessionStore();
  const {
    addPollsColumn,
    removePollsColumn,
    setPollQuestions,
    clearPollQuestions
  } = usePollStore((state) => state);
  const retroId = params.retroId as string;

  const { data: retro, isLoading } = useQuery({
    queryKey: [QUERY_CONSTANTS.RETRO_SESSION.GET_RETRO_SESSION_BY_ID, retroId],
    queryFn: () => getRetroSessionById(retroId),
    enabled: !!retroId,
    gcTime: Infinity,
    staleTime: 0
  });

  // Initialize socket connection for this retrospective session
  const { connectionError, isDev } = useRetroSocket({ retroID: retroId });

  useEffect(() => {
    if (retro && retro.code === 200) {
      setRetroSession(retro.data);

      // Clear existing poll options when session changes
      clearPollQuestions();

      // If there are polls, add them to the store
      if (retro.data.questions.length > 0) {
        // Remove existing polls column
        removePollsColumn();
        clearPollQuestions();

        // Add new polls column
        addPollsColumn('Polls Question');
        setPollQuestions(retro.data.questions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retro, retroId]);

  if (isLoading) {
    return <Skeleton className='h-10 w-full' />;
  }

  if (retro && retro.code !== 200) {
    notFound();
  }

  return (
    <div className='flex-1 space-y-4 py-2'>
      {connectionError && isDev && (
        <div className='rounded bg-yellow-50 p-2 text-sm text-yellow-600'>
          Socket connection issue: {connectionError}
        </div>
      )}
      {children}
    </div>
  );
};

export default Layout;

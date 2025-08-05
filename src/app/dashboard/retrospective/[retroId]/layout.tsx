'use client';
import { useQuery } from '@tanstack/react-query';
import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getRetroSessionById } from '@/config/api/retro-session';
import { QUERY_CONSTANTS } from '@/constants/query';
import { useTaskStore } from '@/features/kanban/utils/store';
import { useGetCategories } from '@/hooks/use-category-api';
import { useRetroSocket } from '@/hooks/use-retro-socket';
import { usePollStore } from '@/stores/pollStore';
import { useRetroSessionStore } from '@/stores/retroSessionStore';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const router = useRouter();
  const { setRetroSession } = useRetroSessionStore();
  const {
    addPollsColumn,
    removePollsColumn,
    setPollQuestions,
    clearPollQuestions
  } = usePollStore((state) => state);
  const setStep = useTaskStore((state) => state.setStep);
  const clearStorage = useTaskStore((state) => state.clearStorage);
  const resetState = useTaskStore((state) => state.resetState);
  const retroId = params.retroId as string;

  const { data: retro, isLoading } = useQuery({
    queryKey: [QUERY_CONSTANTS.RETRO_SESSION.GET_RETRO_SESSION_BY_ID, retroId],
    queryFn: () => getRetroSessionById(retroId),
    enabled: !!retroId,
    staleTime: 0
  });

  // Initialize socket connection for this retrospective session
  const { hasError, error, initializeAndSetupSocket } = useRetroSocket({
    roomId: retroId
  });
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const setTasks = useTaskStore((state) => state.setTasks);
  const { data: categoriesData } = useGetCategories();

  useEffect(() => {
    if (hasError) {
      setShowErrorDialog(true);
    }

    return () => {
      setTasks([]);
      resetState();
      clearStorage(); // Clear persisted data when component unmounts
      setRetroSession(null);
    };
  }, [hasError, clearStorage, resetState, setRetroSession, setTasks]);

  const handleDialogClose = () => {
    setShowErrorDialog(false);
    clearStorage(); // Clear persisted data when navigating away due to error
    router.push('/dashboard/retrospective');
  };

  const setCols = useTaskStore((state) => state.setCols);

  useEffect(() => {
    if (retro && retro.code === 200) {
      setRetroSession(retro.data);
      setStep(retro.data.step || 1);
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

  useEffect(() => {
    if (categoriesData?.data) {
      setCols(categoriesData.data);
    }
  }, [categoriesData, setCols]);

  useEffect(() => {
    initializeAndSetupSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Skeleton className='h-10 w-full' />;
  }

  if (retro && retro.code !== 200) {
    notFound();
  }

  return (
    <div className='flex-1 space-y-4'>
      {/* Error Dialog */}
      {showErrorDialog && (
        <div className='fixed inset-0 z-50 backdrop-blur-xs' />
      )}
      <Dialog open={showErrorDialog} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{error?.title}</DialogTitle>
            <DialogDescription>{error?.message}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Only show children if no error */}
      {!hasError && children}
    </div>
  );
};

export default Layout;

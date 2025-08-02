import { isArray } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { BASE_API as SOCKET_URL } from '@/config/proxy';
import {
  PlanItemAction,
  Status,
  useTaskStore
} from '@/features/kanban/utils/store';
import { isDev } from '@/lib/env';
import {
  connect,
  disconnect,
  emitJoinRoom,
  isConnected,
  onAddPlan,
  onChangePositionPlan,
  onDeletePlan,
  onDeletePollQuestion,
  onEditPlan,
  onEditPollQuestion,
  onGeneratePlanItems,
  onJoinFailed,
  onJoinRoom,
  onLeaveRoom,
  onSetStep,
  onSetStepSuccess,
  onVotePollQuestion
} from '@/lib/retro-socket';
import { useAuthStore } from '@/stores/authStore';
import { usePollStore } from '@/stores/pollStore';
import { useRetroSessionStore } from '@/stores/retroSessionStore';

type ErrorInfo = { title: string; message: string } | null;

export const useRetroSocket = ({ roomId = '' }: { roomId?: string } = {}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [error, setError] = useState<ErrorInfo>(null);
  const session = useRetroSessionStore((state) => state.retroSession);
  const { updatePollQuestion, setPollQuestions, removePollQuestion } =
    usePollStore((state) => state);
  const retroId = roomId || session?._id;
  const setTasks = useTaskStore((state) => state.setTasks);
  const setIsGenerating = useTaskStore((state) => state.setIsGenerating);
  const resetState = useTaskStore((state) => state.resetState);
  const tasks = useTaskStore((state) => state.tasks);
  const setStep = useTaskStore((state) => state.setStep);
  const initializeSocket = useCallback(() => {
    if (!SOCKET_URL || !accessToken || isConnected()) {
      return;
    }

    try {
      connect(
        SOCKET_URL,
        { accessToken },
        {
          onConnect: () => {
            if (!retroId) {
              return;
            }
            emitJoinRoom({ sessionId: retroId });
          }
        }
      );
      setError(null);
    } catch (error) {
      setError({
        title: 'Connection Failed',
        message:
          error instanceof Error ? error.message : 'Failed to connect to socket'
      });
    }
  }, [accessToken, retroId]);

  const cleanup = useCallback(() => {
    if (isConnected()) {
      disconnect();
    }
  }, []);

  useEffect(() => {
    if (retroId && SOCKET_URL && accessToken) {
      initializeSocket();
    }

    // Listen to all events and log the data (temporary debug)
    const leaveRoomListener = () => {};
    const addPlanListener = () => {};
    const editPlanListener = () => {};
    const deletePlanListener = () => {};
    const changePositionPlanListener = () => {};
    const generatePlanItemsListener = (data: any) => {
      if (data.data && data.data?.length > 0) {
        console.log('generatePlanItemsListener', data.data);
        setTasks([
          ...tasks,
          ...(data.data?.map((item: PlanItemAction) => ({
            _id: uuidv4(),
            title: item.description,
            status: item.action_type as Status,
            votes: 0
          })) || [])
        ]);
      }
      setIsGenerating(false);
    };
    const setStepListener = (data: any) => {
      const { step } = data.data;
      setStep(step);
    };
    const setStepSuccessListener = (data: any) => {
      console.log('setStepSuccessListener', data);
    };
    // Polls Questions
    const editPollQuestionListener = (res: any) => {
      if (res.code === 200 && res.data && res.data.questions) {
        setPollQuestions(res.data.questions);
      }
    };
    const votePollQuestionListener = (res: any) => {
      if (
        res.code === 200 &&
        res.data &&
        isArray(res.data) &&
        res.data.length > 0
      ) {
        updatePollQuestion(res.data[0]._id, res.data[0]);
      }
    };
    onJoinRoom((res) => {
      if (res.code === 200) {
        setError(null);
      }
    });
    onJoinFailed((res) => {
      setError({
        title: 'Join Room Failed',
        message: res.msg || 'Failed to join the retrospective room.'
      });
    });
    const deletePollQuestionListener = (res: any) => {
      console.log('deletePollQuestionListener ', res);
      if (res.code === 200) {
        removePollQuestion(res.data.id);
      }
    };
    onLeaveRoom(leaveRoomListener);
    onAddPlan(addPlanListener);
    onEditPlan(editPlanListener);
    onDeletePlan(deletePlanListener);
    onChangePositionPlan(changePositionPlanListener);
    onEditPollQuestion(editPollQuestionListener);
    onVotePollQuestion(votePollQuestionListener);
    onDeletePollQuestion(deletePollQuestionListener);
    onGeneratePlanItems(generatePlanItemsListener);
    onSetStep(setStepListener);
    onSetStepSuccess(setStepSuccessListener);
    return cleanup;
  }, [initializeSocket, cleanup, retroId, accessToken]);

  const hasError = useMemo(() => error !== null, [error]);

  return {
    error,
    hasError,
    isDev
  };
};

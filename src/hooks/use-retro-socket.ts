import { isArray } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { showNotification } from '@/components/common';
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
  onAddActionItem,
  onAddPlan,
  onChangePositionPlan,
  onCreateKeyInsights,
  onCreateQuestion,
  onDeleteActionItem,
  onDeletePlan,
  onDeletePollQuestion,
  onEditActionItem,
  onEditPlan,
  onEditPollQuestion,
  onGeneratePlanItems,
  onJoinFailed,
  onJoinRoom,
  onLeaveRoom,
  onRadarCriteriaCreated,
  onSetStep,
  onSetStepSuccess,
  onVotePollQuestion
} from '@/lib/retro-socket';
import { useAuthStore } from '@/stores/authStore';
import { usePollStore } from '@/stores/pollStore';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { IRetroSession } from '@/types';
import { RetroListenEvents, SocketResponse } from '@/types/retro-socket';

import { useSignOut } from './use-auth';

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
  const tasks = useTaskStore((state) => state.tasks);
  const setStep = useTaskStore((state) => state.setStep);
  const setRetroSession = useRetroSessionStore(
    (state) => state.setRetroSession
  );
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
    const joinFailedListener = (data: any) => {
      if (data.code === 409) {
        setError({
          title: 'Session Expired',
          message: 'Login again to continue.'
        });
      }
    };
    const leaveRoomListener = () => {};
    const addPlanListener = () => {};
    const editPlanListener = () => {};
    const deletePlanListener = () => {};
    const changePositionPlanListener = () => {};
    const createRadarCriteriaListener = (
      data: SocketResponse<RetroListenEvents['create-radar-criteria']>
    ) => {
      console.log('createRadarCriteriaListener', data);
      if (data.code === 200) {
        setRetroSession({
          ...session!,
          radar_criteria: data.data.map((item) => ({
            _id: item._id,
            criteria: item.criteria,
            score: item.score
          }))
        });
      } else {
        toast.error(data.msg);
      }
    };
    const generatePlanItemsListener = (data: any) => {
      if (data.data && data.data?.length > 0) {
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
    const setStepSuccessListener = (data: any) => {};
    const createKeyInsightsListener = (
      data: SocketResponse<RetroListenEvents['create-key-insights']>
    ) => {
      if (data.code === 200) {
        setRetroSession({
          ...session!,
          keyInsights: data.data.map((item) => ({
            _id: item._id,
            title: item.title,
            description: item.description
          }))
        });
      }
    };
    const addActionItemListener = (data: any) => {
      if (data.code === 200) {
        setRetroSession((currentSession: IRetroSession | null) => {
          if (!currentSession) return currentSession;

          return {
            ...currentSession,
            actionItems: [
              ...currentSession.actionItems,
              {
                _id: data.data._id,
                title: data.data.title,
                description: data.data.description,
                status: data.data.status,
                assignee_to: data.data.assignee_to
              }
            ]
          };
        });
      } else {
        toast.error(data.msg);
      }
    };

    const editActionItemListener = (data: any) => {
      if (data.code === 200) {
        setRetroSession({
          ...session!,
          actionItems: session!.actionItems.map((item) =>
            item._id === data.data._id ? data.data : item
          )
        });
      } else {
        toast.error(data.msg);
      }
    };

    const deleteActionItemListener = (data: any) => {
      console.log('deleteActionItemListener', data);
      if (data.code === 200) {
        setRetroSession({
          ...session!,
          actionItems: session!.actionItems.filter(
            (item) => item._id !== data.data._id
          )
        });
      } else {
        toast.error(data.msg);
      }
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
    const createQuestionListener = (res: any) => {
      if (res?.questions && res?.questions?.length > 0) {
        setPollQuestions(res?.questions || []);
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
    onJoinFailed(joinFailedListener);
    onRadarCriteriaCreated(createRadarCriteriaListener);
    onCreateKeyInsights(createKeyInsightsListener);

    onAddActionItem(addActionItemListener);
    onEditActionItem(editActionItemListener);
    onDeleteActionItem(deleteActionItemListener);
    onCreateQuestion(createQuestionListener);

    return cleanup;
  }, [initializeSocket, cleanup, retroId, accessToken]);

  const hasError = useMemo(() => error !== null, [error]);

  return {
    error,
    hasError,
    isDev
  };
};

import { isArray } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { BASE_API as SOCKET_URL } from '@/config/proxy';
import { queryClient } from '@/config/query-client';
import { QUERY_CONSTANTS } from '@/constants/query';
import { Column } from '@/features/kanban/components/board-column';
import { useTaskStore } from '@/features/kanban/utils/store';
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

type ErrorInfo = { title: string; message: string } | null;

export const useRetroSocket = ({ roomId = '' }: { roomId?: string } = {}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [error, setError] = useState<ErrorInfo>(null);
  const session = useRetroSessionStore((state) => state.retroSession);
  const {
    addPollsColumn,
    updatePollQuestion,
    setPollQuestions,
    removePollQuestion
  } = usePollStore((state) => state);
  const retroId = roomId || session?._id;
  const setTasks = useTaskStore((state) => state.setTasks);
  const setTask = useTaskStore((state) => state.setTask);
  const setIsGenerating = useTaskStore((state) => state.setIsGenerating);
  const tasks = useTaskStore((state) => state.tasks);
  const setStep = useTaskStore((state) => state.setStep);
  const setRetroSession = useRetroSessionStore(
    (state) => state.setRetroSession
  );

  const columns = useTaskStore((state) => state.columns);

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

  const setupSocketListeners = useCallback(() => {
    if (!retroId || !SOCKET_URL || !accessToken) {
      return;
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
    const changePositionPlanListener = (data: any) => {
      if (data.code === 200) {
        const updatedTask = {
          _id: data.data._id,
          title: data.data.text,
          status: data.data.category_id,
          votes: 0,
          position: data.data.position
        };
        setTask(updatedTask);
      } else {
        toast.error(data.msg);
      }
    };

    const generatePlanItemsListener = (data: any) => {
      if (data.data && data.data?.length > 0) {
        const newTasks = [
          ...tasks,
          ...(data.data?.map((item: any) => ({
            _id: item._id,
            title: item.text,
            status: item.category_id,
            votes: 0
          })) || [])
        ];
        setTasks(newTasks);
      }
      setIsGenerating(false);
    };
    const setStepListener = (data: any) => {
      const { step } = data.data;
      setStep(step);
    };
    const setStepSuccessListener = (data: any) => {};

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
      if (data.code === 200) {
        setRetroSession((currentSession: IRetroSession | null) => {
          if (!currentSession) return currentSession;

          return {
            ...currentSession,
            actionItems: currentSession.actionItems.filter(
              (item) => item._id !== data.data._id
            )
          };
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
      if (res.code === 200) {
        removePollQuestion(res.data.id);
      }
    };
    const createQuestionListener = (res: any) => {
      if (res?.questions && res?.questions?.length > 0) {
        addPollsColumn('Polls Question');
        setPollQuestions(res?.questions || []);
      }
    };
    onLeaveRoom(leaveRoomListener);
    onAddPlan(({ code, data, msg }) => {
      if (code === 200) {
        const newTask = {
          _id: data._id,
          title: data.text,
          status: data.category_id,
          votes: 0,
          position: data.position
        };
        setTask(newTask);
      } else {
        toast.error(msg);
      }
    });
    onEditPlan((data) => {
      if (data.code === 200) {
        const updatedTask = {
          _id: data.data._id,
          title: data.data.text,
          status: data.data.category_id || data.data.status,
          votes: 0,
          position: data.data.position
        };
        setTask(updatedTask);
      } else {
        toast.error(data.msg);
      }
    });
    onDeletePlan((data) => {
      if (data.code === 200) {
        // Invalidate the retro session query to refetch fresh data
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_CONSTANTS.RETRO_SESSION.GET_RETRO_SESSION_BY_ID,
            retroId
          ]
        });
      } else {
        toast.error(data.msg);
      }
    });
    onChangePositionPlan(changePositionPlanListener);
    onEditPollQuestion(editPollQuestionListener);
    onVotePollQuestion(votePollQuestionListener);
    onDeletePollQuestion(deletePollQuestionListener);
    onGeneratePlanItems(generatePlanItemsListener);
    onSetStep(setStepListener);
    onSetStepSuccess(setStepSuccessListener);
    onJoinFailed(joinFailedListener);

    onAddActionItem(addActionItemListener);
    onEditActionItem(editActionItemListener);
    onDeleteActionItem(deleteActionItemListener);
    onCreateQuestion(createQuestionListener);
  }, [
    retroId,
    accessToken,
    setTask,
    setIsGenerating,
    tasks,
    setTasks,
    columns,
    setStep,
    setRetroSession,
    session,
    setPollQuestions,
    updatePollQuestion,
    removePollQuestion,
    addPollsColumn
  ]);

  const getTaskStatus = (status: string, columns: Column[]) => {
    const mapper = columns.map((column) => {
      if (column.title.toUpperCase() === status.toUpperCase()) {
        return column.id;
      } else {
        return null;
      }
    });
    return mapper.find((item) => item !== null);
  };

  const hasError = useMemo(() => error !== null, [error]);

  const initializeAndSetupSocket = useCallback(() => {
    initializeSocket();
  }, [initializeSocket]);

  useEffect(() => {
    const createRadarCriteriaListener = (
      data: SocketResponse<RetroListenEvents['create-radar-criteria']>
    ) => {
      if (data.code === 200) {
        const newSession = {
          ...session!,
          radar_criteria: data.data.map((item) => ({
            _id: item._id,
            criteria: item.criteria,
            score: item.score
          }))
        };
        setRetroSession(newSession);
      } else {
        toast.error(data.msg);
      }
    };

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

    onRadarCriteriaCreated(createRadarCriteriaListener);
    onCreateKeyInsights(createKeyInsightsListener);
  }, [session, setRetroSession]);

  return {
    error,
    hasError,
    isDev,
    retroId,
    cleanup,
    initializeAndSetupSocket,
    setupSocketListeners
  };
};

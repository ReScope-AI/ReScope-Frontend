import { useCallback, useEffect, useMemo, useState } from 'react';

import { BASE_API as SOCKET_URL } from '@/config/proxy';
import { isDev } from '@/lib/env';
import {
  connect,
  disconnect,
  emitJoinRoom,
  isConnected,
  onAddPlan,
  onChangePositionPlan,
  onDeletePlan,
  onEditPlan,
  onJoinFailed,
  onJoinRoom,
  onLeaveRoom
} from '@/lib/retro-socket';
import { useAuthStore } from '@/stores/authStore';
import { useRetroSessionStore } from '@/stores/retroSessionStore';

type ErrorInfo = { title: string; message: string } | null;

export const useRetroSocket = ({ roomId }: { roomId?: string } = {}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [error, setError] = useState<ErrorInfo>(null);
  const session = useRetroSessionStore((state) => state.retroSession);
  const retroId = roomId || session?._id;

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
    onLeaveRoom(leaveRoomListener);
    onAddPlan(addPlanListener);
    onEditPlan(editPlanListener);
    onDeletePlan(deletePlanListener);
    onChangePositionPlan(changePositionPlanListener);

    return cleanup;
  }, [initializeSocket, cleanup, retroId, accessToken]);

  const hasError = useMemo(() => error !== null, [error]);

  return {
    error,
    hasError,
    isDev
  };
};

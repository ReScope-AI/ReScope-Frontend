import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import {
  connect,
  disconnect,
  on,
  off,
  emit,
  isConnected,
  getSocket
} from '@/lib/retro-socket';
import { RetroSocketEvents } from '@/types/retro-socket';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { useAuthStore } from '@/stores/authStore';

const SOCKET_SERVER_URL = 'http://localhost:3000';

export const useRetroSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const retroSession = useRetroSessionStore((state) => state.retroSession);
  const accessToken = useAuthStore((state) => state.accessToken);

  const onConnect = useCallback(() => {
    if (retroSession?._id && getSocket()?.connected && accessToken) {
      emit('join-room', { room: retroSession._id });
    }
  }, [retroSession, accessToken]);

  const onDisconnect = useCallback(() => {
    if (retroSession?._id && getSocket()?.connected && accessToken) {
      emit('leave-room', { room: retroSession._id });
    }
  }, [retroSession, accessToken]);

  const onReconnect = useCallback((attempt: number) => {}, []);

  useEffect(() => {
    if (!retroSession?._id || isConnected() || !accessToken) {
      return;
    }

    const newSocket = connect(SOCKET_SERVER_URL, {
      accessToken: accessToken
    });
    setSocket(newSocket);

    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);
    newSocket.on('reconnect', onReconnect);

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('reconnect', onReconnect);

      disconnect();
    };
  }, [retroSession, accessToken, onConnect, onDisconnect, onReconnect]);

  const listen = useCallback(
    <K extends keyof RetroSocketEvents>(
      event: K,
      callback: (data: RetroSocketEvents[K]) => void
    ) => {
      if (socket) {
        on(event as string, callback as (...args: any[]) => void);
      }
    },
    [socket]
  );

  const unlisten = useCallback(
    <K extends keyof RetroSocketEvents>(
      event: K,
      callback: (data: RetroSocketEvents[K]) => void
    ) => {
      if (socket) {
        off(event as string, callback as (...args: any[]) => void);
      }
    },
    [socket]
  );

  const emitEvent = useCallback(
    <K extends keyof RetroSocketEvents>(
      event: K,
      data: RetroSocketEvents[K]
    ) => {
      if (socket) {
        emit(event, data);
      }
    },
    [socket]
  );

  return {
    socket,
    isConnected: isConnected(),
    emit: emitEvent,
    on: listen,
    off: unlisten
  };
};

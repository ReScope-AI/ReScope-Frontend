import { Socket } from 'socket.io-client';

import {
  SocketConnectionOptions,
  RetroEmitEvents,
  RetroListenEvents,
  SocketResponse,
  RetroSocketMessage
} from '@/types/retro-socket';

import { isDev } from './env';
import { getSocketIo } from './socket-manager';

// Helper HOC to create typed on functions
function createOnFunction<T extends keyof RetroListenEvents>(event: T) {
  return (
    callback: (response: SocketResponse<RetroListenEvents[T]>) => void
  ): void => {
    on(event, callback);
  };
}

let socket: Socket | null = null;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;
const BASE_EVENT = 'retro-session';

// Event handler callbacks
type EventCallbacks = {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onConnectError?: (error: Error) => void;
  onReconnect?: (attemptNumber: number) => void;
  onReconnectError?: (error: Error) => void;
};

let eventCallbacks: EventCallbacks = {};

export function connect(
  socketUrl: string,
  options: SocketConnectionOptions,
  callbacks?: EventCallbacks
): Socket {
  if (socket?.connected) {
    return socket;
  }

  if (callbacks) {
    eventCallbacks = callbacks;
  }

  socket = getSocketIo(socketUrl, {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${options.accessToken}`
        }
      }
    },
    timeout: 10000,
    reconnection: true,
    reconnectionAttempts: MAX_RETRY_ATTEMPTS,
    reconnectionDelay: RETRY_DELAY
  });

  setupEventHandlers();

  return socket;
}

function setupEventHandlers(): void {
  if (!socket) return;

  socket.off('connect', onConnect);
  socket.off('disconnect', onDisconnect);
  socket.off('connect_error', onConnectError);
  socket.off('reconnect', onReconnect);
  socket.off('reconnect_error', onReconnectError);

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('connect_error', onConnectError);
  socket.on('reconnect', onReconnect);
  socket.on('reconnect_error', onReconnectError);

  if (isDev) {
    socket.onAny((event, ...args) => {
      console.log('[Socket Event]', event, args);
    });
  }
}

function onConnect(): void {
  connectionAttempts = 0;
  if (isDev) {
    console.info('Socket connected:', socket?.id);
  }
  eventCallbacks.onConnect?.();
}

function onDisconnect(reason: string): void {
  if (isDev) {
    console.info('Socket disconnected:', reason);
  }
  eventCallbacks.onDisconnect?.(reason);
}

function onConnectError(error: Error): void {
  connectionAttempts++;
  if (isDev) {
    console.error('Socket connection error:', error.message);
  }

  if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
    console.error('Max connection attempts reached. Socket connection failed.');
  }

  eventCallbacks.onConnectError?.(error);
}

function onReconnect(attemptNumber: number): void {
  if (isDev) {
    console.info('Socket reconnected after', attemptNumber, 'attempts');
  }
  eventCallbacks.onReconnect?.(attemptNumber);
}

function onReconnectError(error: Error): void {
  if (isDev) {
    console.error('Socket reconnection error:', error.message);
  }
  eventCallbacks.onReconnectError?.(error);
}

export function emit<T extends keyof RetroEmitEvents>(
  baseEvent: string,
  message: RetroSocketMessage<T>
): void {
  if (socket?.connected) {
    socket.emit(baseEvent, message);
  } else if (socket && !socket.connected) {
    socket.once('connect', () => {
      socket?.emit(baseEvent, message);
    });
  }
}

export function on<K extends keyof RetroListenEvents>(
  event: K,
  callback: (response: SocketResponse<RetroListenEvents[K]>) => void
): void {
  socket?.on(event as string, callback);
}

export function off<K extends keyof RetroListenEvents>(
  event: K,
  callback?: (response: SocketResponse<RetroListenEvents[K]>) => void
): void {
  socket?.off(event, callback as any);
}

export function disconnect(): void {
  if (socket) {
    eventCallbacks = {};
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function isConnected(): boolean {
  return socket?.connected || false;
}

export function updateEventCallbacks(callbacks: EventCallbacks): void {
  eventCallbacks = { ...eventCallbacks, ...callbacks };
}

export function emitJoinRoom(sessionId: string, room?: string): void {
  emit(BASE_EVENT, { room, event: 'join-room', data: { sessionId } });
}

export function emitLeaveRoom(sessionId: string, room?: string): void {
  emit(BASE_EVENT, { room, event: 'leave-room', data: { sessionId } });
}

export function emitAddPlan(
  data: RetroEmitEvents['add-plan'],
  room?: string
): void {
  emit(BASE_EVENT, { room, event: 'add-plan', data });
}

export function emitEditPlan(
  data: RetroEmitEvents['edit-plan'],
  room?: string
): void {
  emit(BASE_EVENT, { room, event: 'edit-plan', data });
}

export function emitDeletePlan(
  data: RetroEmitEvents['delete-plan'],
  room?: string
): void {
  emit(BASE_EVENT, { room, event: 'delete-plan', data });
}

export function emitChangePositionPlan(
  data: RetroEmitEvents['change-position-plan'],
  room?: string
): void {
  emit(BASE_EVENT, { room, event: 'change-position-plan', data });
}

export function emitEditPollQuestion(
  data: RetroEmitEvents['edit-poll-question'],
  room?: string
): void {
  emit(BASE_EVENT, { room, event: 'edit-poll-question', data });
}

export const onJoinRoom = createOnFunction('join-room');
export const onJoinFailed = createOnFunction('join-failed');
export const onLeaveRoom = createOnFunction('leave-room');
export const onAddPlan = createOnFunction('add-plan');
export const onEditPlan = createOnFunction('edit-plan');
export const onDeletePlan = createOnFunction('delete-plan');
export const onChangePositionPlan = createOnFunction('change-position-plan');
export const onEditPollQuestion = createOnFunction('edit-poll-question');

import { Socket } from 'socket.io-client';

import {
  ReScopeEmitEvents,
  RetroEmitEvents,
  RetroListenEvents,
  SocketConnectionOptions,
  SocketResponse
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

  // Store callbacks for later use
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

  // Remove existing listeners to prevent duplicates
  socket.off('connect', onConnect);
  socket.off('disconnect', onDisconnect);
  socket.off('connect_error', onConnectError);
  socket.off('reconnect', onReconnect);
  socket.off('reconnect_error', onReconnectError);

  // Add fresh listeners
  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('connect_error', onConnectError);
  socket.on('reconnect', onReconnect);
  socket.on('reconnect_error', onReconnectError);

  // Debug logging for development
  if (isDev) {
    socket.onAny((event, ...args) => {
      // eslint-disable-next-line no-console
      console.log('[Socket Event]', event, args);
    });
  }
}

function onConnect(): void {
  connectionAttempts = 0;
  if (isDev) {
    // eslint-disable-next-line no-console
    console.info('Socket connected:', socket?.id);
  }
  eventCallbacks.onConnect?.();
}

function onDisconnect(reason: string): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.info('Socket disconnected:', reason);
  }
  eventCallbacks.onDisconnect?.(reason);
}

function onConnectError(error: Error): void {
  connectionAttempts++;
  if (isDev) {
    // eslint-disable-next-line no-console
    console.error('Socket connection error:', error.message);
  }

  if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
    // eslint-disable-next-line no-console
    console.error('Max connection attempts reached. Socket connection failed.');
  }

  eventCallbacks.onConnectError?.(error);
}

function onReconnect(attemptNumber: number): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.info('Socket reconnected after', attemptNumber, 'attempts');
  }
  eventCallbacks.onReconnect?.(attemptNumber);
}

function onReconnectError(error: Error): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.error('Socket reconnection error:', error.message);
  }
  eventCallbacks.onReconnectError?.(error);
}

export function emit<K extends keyof RetroEmitEvents>(
  event: K,
  data: RetroEmitEvents[K]
): void {
  if (socket?.connected) {
    socket.emit(event, data);
  } else if (socket && !socket.connected) {
    // If socket is not connected, queue the emit for when it connects
    socket.once('connect', () => {
      socket?.emit(event, data);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket?.off(event, callback as any);
}

export function disconnect(): void {
  if (socket) {
    // Clear event callbacks
    eventCallbacks = {};

    // Remove all listeners to prevent memory leaks
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

// Utility function to update event callbacks
export function updateEventCallbacks(callbacks: EventCallbacks): void {
  eventCallbacks = { ...eventCallbacks, ...callbacks };
}

// Convenience emit functions for specific events
export function emitJoinRoom(data: RetroEmitEvents['join-room']): void {
  emit('join-room', data);
}

export function emitLeaveRoom(data: RetroEmitEvents['leave-room']): void {
  emit('leave-room', data);
}

export function emitAddPlan({
  roomId,
  ...data
}: ReScopeEmitEvents['add-plan']): void {
  emit('re-scope', { event: 'add-plan', room: roomId, data });
}

export function emitEditPlan({
  roomId,
  ...data
}: ReScopeEmitEvents['edit-plan']): void {
  emit('re-scope', { event: 'edit-plan', room: roomId, data });
}

export function emitDeletePlan({
  roomId,
  ...data
}: ReScopeEmitEvents['delete-plan']): void {
  emit('re-scope', { event: 'delete-plan', room: roomId, data });
}

export function emitChangePositionPlan({
  roomId,
  ...data
}: ReScopeEmitEvents['change-position-plan']): void {
  emit('re-scope', {
    event: 'change-position-plan',
    room: roomId,
    data
  });
}

export function emitEditPollQuestion({
  roomId,
  ...data
}: ReScopeEmitEvents['edit-poll-question']): void {
  emit('re-scope', { event: 'edit-poll-question', room: roomId, data });
}

export function emitVotePollQuestion({
  roomId,
  ...data
}: ReScopeEmitEvents['vote-question']): void {
  emit('re-scope', { event: 'vote-question', room: roomId, data });
}

export function emitDeletePollQuestion({
  roomId,
  ...data
}: ReScopeEmitEvents['delete-question']): void {
  emit('re-scope', { event: 'delete-question', room: roomId, data });
}

export function emitGeneratePlanItems(
  roomId: string,
  data: ReScopeEmitEvents['generate-plan-items']
): void {
  emit('re-scope', { event: 'generate-plan-items', room: roomId, data });
}

export function emitSetStep(roomId: string, step: number): void {
  emit('re-scope', { event: 'set-step', room: roomId, data: { step } });
}

export function emitAddActionItem({
  roomId,
  ...data
}: ReScopeEmitEvents['add-action-item']): void {
  emit('re-scope', { event: 'add-action-item', room: roomId, data });
}

export function emitEditActionItem({
  roomId,
  ...data
}: ReScopeEmitEvents['edit-action-item']): void {
  emit('re-scope', { event: 'edit-action-item', room: roomId, data });
}

export function emitDeleteActionItem({
  roomId,
  ...data
}: ReScopeEmitEvents['delete-action-item']): void {
  emit('re-scope', { event: 'delete-action-item', room: roomId, data });
}

// Convenience on functions for listening to events
export const onJoinRoom = createOnFunction('join-room');
export const onJoinFailed = createOnFunction('join-failed');
export const onLeaveRoom = createOnFunction('leave-room');
export const onAddPlan = createOnFunction('add-plan');
export const onEditPlan = createOnFunction('edit-plan');
export const onDeletePlan = createOnFunction('delete-plan');
export const onChangePositionPlan = createOnFunction('change-position-plan');
export const onEditPollQuestion = createOnFunction('edit-poll-question');
export const onVotePollQuestion = createOnFunction('vote-question');
export const onDeletePollQuestion = createOnFunction('delete-question');
export const onGeneratePlanItems = createOnFunction('generate-plan-items');
export const onActiveGeneratePlanItems = createOnFunction(
  'active-generate-plan-items'
);
export const onSetStep = createOnFunction('set-step');
export const onSetStepSuccess = createOnFunction('set-step-success');
export const onRadarCriteriaCreated = createOnFunction('create-radar-criteria');
export const onAddActionItem = createOnFunction('add-action-item');
export const onEditActionItem = createOnFunction('edit-action-item');
export const onDeleteActionItem = createOnFunction('delete-action-item');

export const onCreateKeyInsights = createOnFunction('create-key-insights');

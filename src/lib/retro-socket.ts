import { Socket } from 'socket.io-client';
import { getSocketIo } from './socket-manager';
import {
  SocketConnectionOptions,
  RetroSocketEvents
} from '@/types/retro-socket';
import { isDev } from './env';

let socket: Socket | null = null;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

export function connect(
  socketUrl: string,
  options: SocketConnectionOptions
): Socket {
  if (socket?.connected) {
    return socket;
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
}

function onConnect(): void {
  connectionAttempts = 0;
  if (isDev) {
    // eslint-disable-next-line no-console
    console.info('Socket connected:', socket?.id);
  }
}

function onDisconnect(reason: string): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.info('Socket disconnected:', reason);
  }
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
}

function onReconnect(attemptNumber: number): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.info('Socket reconnected after', attemptNumber, 'attempts');
  }
}

function onReconnectError(error: Error): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.error('Socket reconnection error:', error.message);
  }
}

export function emit<K extends keyof RetroSocketEvents>(
  event: K,
  data: RetroSocketEvents[K]
): void {
  if (socket?.connected) {
    socket.emit(event, data);
  }
}

export function on(event: string, callback: (...args: any[]) => void): void {
  socket?.on(event, callback);
}

export function off(event: string, callback?: (...args: any[]) => void): void {
  socket?.off(event, callback);
}

export function disconnect(): void {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}

export function isConnected(): boolean {
  return socket?.connected || false;
}

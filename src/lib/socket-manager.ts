import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';

const socketMap: Map<string, Socket> = new Map();

/**
 * Retrieves a Socket.IO client instance for the given URL.
 * If an instance already exists for the URL, it returns that instance.
 * Otherwise, it creates a new instance and stores it in the map.
 *
 * @param url - The URL to connect to.
 * @param opts - Optional configuration options for the socket connection.
 * @returns A Socket.IO client instance.
 */
export function getSocketIo(
  url: string,
  opts?: Partial<ManagerOptions & SocketOptions>
): Socket {
  if (socketMap.has(url)) {
    const existingSocket = socketMap.get(url)!;
    // If the socket is still connected, return it
    if (existingSocket.connected) {
      return existingSocket;
    }
    // If disconnected, remove it from the map and create a new one
    socketMap.delete(url);
  }

  const socket = io(url, opts);
  socketMap.set(url, socket);

  // Clean up the map when the socket disconnects permanently
  const cleanup = () => {
    if (socketMap.get(url) === socket) {
      socketMap.delete(url);
    }
  };

  // Only clean up on permanent disconnection, not temporary ones
  socket.on('disconnect', (reason) => {
    if (
      reason === 'io server disconnect' ||
      reason === 'io client disconnect'
    ) {
      cleanup();
    }
  });

  return socket;
}

export function cleanupAllSockets(): void {
  socketMap.forEach((socket) => {
    if (socket.connected) {
      socket.disconnect();
    }
  });
  socketMap.clear();
}

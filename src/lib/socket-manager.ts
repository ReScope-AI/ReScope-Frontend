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
    return socketMap.get(url)!;
  }
  const socket = io(url, opts);
  socketMap.set(url, socket);

  // Optional: Clean up the map when the socket disconnects
  const cleanup = () => {
    if (socketMap.get(url) === socket) {
      socketMap.delete(url);
    }
  };
  socket.on('disconnect', cleanup);
  socket.on('connect_error', cleanup);

  return socket;
}

export interface SocketEventData {
  room: string;
  event: string;
  data: any;
}

export interface RetroSocketEvents {
  'create-action': SocketEventData;
  'join-room': { room: string };
  'leave-room': { room: string };
  'user-joined': { userId: string; room: string };
  'user-left': { userId: string; room: string };
  'retro-updated': { retroId: string; data: any };
}

export interface SocketConnectionOptions {
  accessToken: string;
}

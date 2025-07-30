export interface SocketEventData {
  room: string;
  event: string;
  data: any;
}

export interface RetroEmitEvents {
  'join-room': {
    sessionId: string;
  };
  'leave-room': {
    sessionId: string;
  };
  'add-plan': {
    session_id: string;
    category_id: string;
    text: string;
  };
  'edit-plan': {
    id: string;
    text: string;
  };
  'delete-plan': {
    id: string;
  };
  'change-position-plan': {
    above?: string;
    under?: string;
    changePlan: string;
    category_id: string;
  };
}

export interface RetroListenEvents {
  'join-room': any;
  'leave-room': any;
  'add-plan': any;
  'edit-plan': any;
  'delete-plan': any;
  'change-position-plan': any;
}

export interface SocketConnectionOptions {
  accessToken: string;
}

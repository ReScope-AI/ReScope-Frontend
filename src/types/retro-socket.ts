// Helper type for standard response pattern
export type SocketResponse<T> = {
  code: number;
  data: T;
  msg: string;
};

// Base message structure for all socket events
export interface RetroSocketMessage<T extends keyof RetroEmitEvents> {
  room?: string;
  event: T;
  data: RetroEmitEvents[T];
}

// Event data types for each specific event
export interface RetroEmitEvents {
  'join-room': {
    sessionId: string;
  };
  'edit-poll-question': {
    questionId: string;
    text: string;
    option?: {
      optionId: string;
      text: string;
    }[];
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
  'join-failed': never;
  'leave-room': any;
  'add-plan': any;
  'edit-plan': any;
  'delete-plan': any;
  'change-position-plan': any;
  'edit-poll-question': any;
}

export interface SocketConnectionOptions {
  accessToken: string;
}

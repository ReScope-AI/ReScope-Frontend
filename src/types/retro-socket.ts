// Helper type for standard response pattern
export type SocketResponse<T> = {
  code: number;
  data: T;
  msg: string;
};

export interface RetroEmitEvents {
  'join-room': {
    sessionId: string;
  };
  'leave-room': {
    sessionId: string;
  };
  're-scope': ReScopeEmitEvent<keyof ReScopeEmitEventsInternal>;
}

type ReScopeEmitEvent<T extends keyof ReScopeEmitEventsInternal> = {
  event: T;
  room: string;
  data: ReScopeEmitEventsInternal[T];
};

type WithRoomIds<T extends object> = {
  [K in keyof T]: T[K] & { roomId: string };
};

interface ReScopeEmitEventsInternal {
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
  'generate-plan-items': any;
  'edit-poll-question': {
    questionId: string;
    text: string;
    option?: {
      optionId: string;
      text: string;
    }[];
  };
}

export type ReScopeEmitEvents = WithRoomIds<ReScopeEmitEventsInternal>;

export interface RetroListenEvents {
  'join-room': any;
  'join-failed': never;
  'leave-room': any;
  'add-plan': any;
  'edit-plan': any;
  'delete-plan': any;
  'change-position-plan': any;
  'generate-plan-items': any;
  'edit-poll-question': any;
}

export interface SocketConnectionOptions {
  accessToken: string;
}

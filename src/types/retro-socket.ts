import { IRetroSession } from './IRetroSession';

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
      optionId: string | null;
      text: string;
    }[];
  };
  'vote-question': {
    question_id: string;
    option_id: string;
  };
  'delete-question': {
    id: string;
  };
  'set-step': {
    step: number;
  };
  'set-step-success': {
    step: number;
  };
  'create-radar-criteria': any;
  'add-action-item': {
    _id: string;
    session_id: string;
    title: string;
    priority?: string;
    description?: string;
    assignee_to?: string | null;
    status: string;
  };
  'edit-action-item': {
    _id: string;
    title: string;
    description?: string;
    assignee_to?: string | null;
    status: string;
    priority?: string;
  };
  'delete-action-item': {
    _id: string;
  };
}

export type ReScopeEmitEvents = WithRoomIds<ReScopeEmitEventsInternal>;

export interface RetroListenEvents {
  'join-room': any;
  'join-failed': never;
  'leave-room': any;
  'add-plan': {
    session_id: string;
    category_id: string;
    position: number;
    text: string;
    created_by: string;
    updated_by: string;
    _id: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  'edit-plan': any;
  'delete-plan': any;
  'change-position-plan': any;
  'generate-plan-items': any;
  'edit-poll-question': any;
  'vote-question': any;
  'delete-question': any;
  'active-generate-plan-items': any;
  'set-step': {
    step: number;
  };
  'set-step-success': any;
  'create-radar-criteria': {
    _id: string;
    criteria: string;
    score: number;
  }[];
  'add-action-item': {
    _id: string;
    session_id: string;
    title: string;
    description?: string;
    status: string;
    priority?: string;
  };
  'edit-action-item': {
    _id: string;
    title: string;
    description?: string;
    assignee_to?: string | null;
    status: string;
  };
  'delete-action-item': {
    _id: string;
  };
  'create-key-insights': {
    _id: string;
    session_id: string;
    title: string;
    description?: string;
  }[];
  'create-question': IRetroSession;
}

export interface SocketConnectionOptions {
  accessToken: string;
}

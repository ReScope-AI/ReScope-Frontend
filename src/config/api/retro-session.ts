import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';
import {
  ICreateRetroSession,
  IInviteToRetro,
  IRetroSession,
  Response
} from '@/types';

const SESSION_API_URL = {
  CREATE: '/retro-session',
  LIST: '/retro-session/list-retro-sessions',
  DELETE: '/retro-session',
  GET: '/retro-session',
  ADD_PARTICIPANT: '/retro-session-participant',
  LIST_INVITED: '/retro-session/list-retro-sessions/invite'
};

export const createRetroSession = async (
  data: ICreateRetroSession
): Promise<Response<IRetroSession>> => {
  const response = await request(
    SESSION_API_URL.CREATE,
    {
      method: 'POST',
      data
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getRetroSessions = async () => {
  const response = await request(
    SESSION_API_URL.LIST,
    {
      method: 'GET'
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getInvitedRetroSessions = async () => {
  const response = await request(
    SESSION_API_URL.LIST_INVITED,
    {
      method: 'GET'
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const deleteRetroSession = async (id: string) => {
  const response = await request(
    `${SESSION_API_URL.DELETE}/${id}`,
    {
      method: 'DELETE'
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getRetroSessionById = async (
  id: string
): Promise<Response<IRetroSession>> => {
  const response = await request(
    `${SESSION_API_URL.GET}/${id}`,
    {
      method: 'GET'
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const addRetroSessionParticipant = async (
  data: IInviteToRetro
): Promise<Response<any>> => {
  const response = await request(
    SESSION_API_URL.ADD_PARTICIPANT,
    {
      method: 'POST',
      data
    },
    API_KEYS.BASE_API
  );
  return response;
};

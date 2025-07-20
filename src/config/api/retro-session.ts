import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';

const SESSION_API_URL = {
  CREATE: '/retro-session',
  LIST: '/retro-session/list-retro-sessions',
  DELETE: '/retro-session'
};

export interface ICreateRetroSession {
  name: string;
  team_id: string;
  sprint_id: string;
  end_date: string;
}

export const createRetroSession = async (data: ICreateRetroSession) => {
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

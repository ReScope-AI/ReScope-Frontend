import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';

export interface ICreateRetroSession {
  name: string;
  startDate: string;
  endDate: string;
  createdBy: string;
}

export const createRetroSession = async (data: ICreateRetroSession) => {
  const response = await request(
    '/retro-sessions',
    {
      method: 'POST',
      data,
      noAuth: true
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getRetroSessions = async () => {
  const response = await request(
    '/retro-sessions/list-retro-sessions',
    {
      method: 'GET',
      noAuth: true
    },
    API_KEYS.BASE_API
  );
  return response;
};

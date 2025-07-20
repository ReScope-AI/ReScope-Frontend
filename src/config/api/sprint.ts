import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';

export interface ICreateSprint {
  name: string;
  start_date: string;
  end_date: string;
  created_by: string;
}

export const createSprint = async (data: ICreateSprint) => {
  const response = await request(
    '/sprints',
    {
      method: 'POST',
      data
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getSprints = async () => {
  const response = await request(
    '/sprints',
    {
      method: 'GET'
    },
    API_KEYS.BASE_API
  );
  return response;
};

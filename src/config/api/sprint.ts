import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';

const SPRINT_API_URL = {
  GET_BY_USER: '/sprints/get-by-user',
  CREATE: '/sprints',
  DELETE: '/sprints/:id'
};

export interface ICreateSprint {
  name: string;
  start_date: string;
  end_date: string;
}

export const createSprint = async (data: ICreateSprint) => {
  const response = await request(
    SPRINT_API_URL.CREATE,
    {
      method: 'POST',
      data
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getSprintsByUser = async () => {
  const response = await request(
    SPRINT_API_URL.GET_BY_USER,
    {
      method: 'GET'
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const deleteSprint = async (id: string) => {
  const response = await request(
    SPRINT_API_URL.DELETE.replace(':id', id),
    {
      method: 'DELETE'
    },
    API_KEYS.BASE_API
  );
  return response;
};

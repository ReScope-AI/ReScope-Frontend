import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';

export interface ICreateSprint {
  name: string;
  startDate: string;
  endDate: string;
  createdBy: string;
}

export const createSprint = async (data: ICreateSprint) => {
  const response = await request(
    '/sprints',
    {
      method: 'POST',
      data,
      noAuth: true
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getSprints = async () => {
  const response = await request(
    '/sprints',
    {
      method: 'GET',
      noAuth: true
    },
    API_KEYS.BASE_API
  );
  return response;
};

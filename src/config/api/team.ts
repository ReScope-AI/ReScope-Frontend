import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';

export interface ICreateTeam {
  name: string;
}

export const createTeam = async (data: ICreateTeam) => {
  const response = await request(
    '/teams/create',
    {
      method: 'POST',
      data
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getTeams = async () => {
  const response = await request(
    '/teams',
    {
      method: 'GET'
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const deleteTeam = async (teamId: string) => {
  const response = await request(
    `/teams/${teamId}`,
    {
      method: 'DELETE'
    },
    API_KEYS.BASE_API
  );
  return response;
};

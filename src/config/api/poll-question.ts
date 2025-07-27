import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';
import { ICreatePollQuestion } from '@/types';

const POLL_QUESTION_API_URL = {
  CREATE: '/poll-question',
  LIST: '/poll-question/list-poll-questions',
  DELETE: '/poll-question',
  GET: '/poll-question'
};

export const createPollQuestion = async (data: ICreatePollQuestion) => {
  const response = await request(
    POLL_QUESTION_API_URL.CREATE,
    {
      method: 'POST',
      data
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getPollQuestions = async (sessionId: string) => {
  const response = await request(
    `${POLL_QUESTION_API_URL.LIST}/${sessionId}`,
    { method: 'GET' },
    API_KEYS.BASE_API
  );
  return response;
};

// export const getRetroSessions = async () => {
//   const response = await request(
//     SESSION_API_URL.LIST,
//     {
//       method: 'GET'
//     },
//     API_KEYS.BASE_API
//   );
//   return response;
// };

// export const deleteRetroSession = async (id: string) => {
//   const response = await request(
//     `${SESSION_API_URL.DELETE}/${id}`,
//     {
//       method: 'DELETE'
//     },
//     API_KEYS.BASE_API
//   );
//   return response;
// };

// export const getRetroSessionById = async (id: string) => {
//   const response = await request(
//     `${SESSION_API_URL.GET}/${id}`,
//     {
//       method: 'GET'
//     },
//     API_KEYS.BASE_API
//   );
//   return response;
// };

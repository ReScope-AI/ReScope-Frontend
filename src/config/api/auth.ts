import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';

export const loginWithGoogle = async (
  googleId: string,
  email: string,
  name: string,
  avatar: string
) => {
  const response = await request(
    '/auth/login-google',
    {
      method: 'POST',
      data: {
        googleId,
        email,
        name,
        avatar
      },
      noAuth: true
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const getProfileAPI = async () => {
  const response = await request(
    '/user/profile',
    {
      method: 'GET'
    },
    API_KEYS.BASE_API
  );
  return response;
};

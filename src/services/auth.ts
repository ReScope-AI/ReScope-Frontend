import axios from 'axios';

export const loginWithGoogle = async (
  googleId: string,
  email: string,
  name: string
) => {
  const response = await axios.post(
    'https://be-rescope.bieprs.io.vn/api/auth/login-google',
    {
      googleId,
      email,
      name
    }
  );
  return response.data;
};

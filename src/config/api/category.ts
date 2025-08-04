import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';
import { ICategory, Response } from '@/types';

const CATEGORY_API_URL = {
  GET: '/category'
};

type GetCategoriesResponse = Response<ICategory[]>;

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const response = await request(
    CATEGORY_API_URL.GET,
    {
      method: 'GET'
    },
    API_KEYS.BASE_API
  );
  return response;
};

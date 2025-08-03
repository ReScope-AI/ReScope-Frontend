import { API_KEYS } from '@/config/proxy';
import request from '@/config/request';
import { IActionItem, ICreateActionItem } from '@/types';

const ACTION_ITEM_API_URL = {
  CREATE: '/action-item',
  EDIT: '/action-item'
};

export const createActionItem = async (data: ICreateActionItem) => {
  const response = await request(
    ACTION_ITEM_API_URL.CREATE,
    {
      method: 'POST',
      data
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const editActionItem = async (data: IActionItem) => {
  const response = await request(
    `${ACTION_ITEM_API_URL.EDIT}/${data._id}`,
    {
      method: 'PUT',
      data
    },
    API_KEYS.BASE_API
  );
  return response;
};

export const deleteActionItem = async (data: IActionItem) => {
  const response = await request(
    `${ACTION_ITEM_API_URL.EDIT}/${data._id}`,
    {
      method: 'DELETE',
      data
    },
    API_KEYS.BASE_API
  );
  return response;
};

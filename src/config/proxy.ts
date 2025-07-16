export const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export const API_KEYS = {
  BASE_API: 'BASE_API'
};

export const PROXY = {
  [API_KEYS.BASE_API]: '/api'
};

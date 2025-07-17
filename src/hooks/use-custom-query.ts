import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSignOut } from './use-auth';
import {
  ApiErrorResponse,
  errorHandling
} from '@/config/request/errorHandling';
import { useEffect } from 'react';

export const useCustomQuery = <
  TQueryFnData,
  TError = AxiosError,
  TData = TQueryFnData
>(
  options: UseQueryOptions<TQueryFnData, TError, TData>
) => {
  const signOut = useSignOut();

  const queryResult = useQuery({
    ...options,
    throwOnError: false
  });

  useEffect(() => {
    if (queryResult.error) {
      const error =
        queryResult.error as unknown as AxiosError<ApiErrorResponse>;
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          signOut.mutate();
        }
      }
      errorHandling(error, true);
    }
  }, [queryResult.error, signOut]);
  return queryResult;
};

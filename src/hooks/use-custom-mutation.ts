import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSignOut } from './use-auth';

export const useCustomMutation = <
  TData = unknown,
  TError = AxiosError,
  TVariables = unknown,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
  const signOut = useSignOut();

  return useMutation({
    ...options,
    onError: (error, variables, context) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          signOut.mutate();
        }
      }
      options.onError?.(error, variables, context);
    }
  });
};

/* eslint-disable no-console */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createActionItem,
  deleteActionItem,
  editActionItem
} from '@/config/api/action-item';
import { IActionItem, ICreateActionItem } from '@/types';

export const useCreateActionItem = (
  onSuccess?: (data: IActionItem) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateActionItem) => createActionItem(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      onSuccess?.(data.data);
    },
    onError: (error) => {
      onError?.(error);
    }
  });
};

export const useEditActionItem = (
  onSuccess?: (data: IActionItem) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IActionItem) => editActionItem(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      onSuccess?.(data.data);
    },
    onError: (error) => {
      onError?.(error);
    }
  });
};

export const useDeleteActionItem = (
  onSuccess?: (data: IActionItem) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IActionItem) => deleteActionItem(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      onSuccess?.(data.data);
    },
    onError: (error) => {
      onError?.(error);
    }
  });
};

/* eslint-disable no-console */
import {
  createRetroSession,
  deleteRetroSession,
  getRetroSessions,
  ICreateRetroSession
} from '@/config/api/retro-session';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type GetRetroSessionResponse = {
  data: {
    _id: string;
    name: string;
    team_id:
      | {
          _id: string;
          name: string;
          created_at: string;
          updated_at: string;
        }
      | string;
    sprint_id:
      | {
          _id: string;
          name: string;
          start_date: string;
          end_date: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        }
      | string;
    end_date: string;
    created_at: string;
    updated_at: string;
  }[];
};

export const useCreateRetroSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateRetroSession) => createRetroSession(data),
    onSuccess: (data) => {
      console.log('Retro session created successfully:', data);
      // Invalidate and refetch retro sessions
      queryClient.invalidateQueries({ queryKey: ['retro-sessions'] });
    },
    onError: (error) => {
      console.error('Failed to create retro session:', error);
    }
  });
};

export const useGetRetroSessions = () => {
  return useQuery<GetRetroSessionResponse>({
    queryKey: ['retro-sessions'],
    queryFn: getRetroSessions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true // Refetch when component mounts
  });
};

export const useDeleteRetroSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRetroSession(id),
    onSuccess: (data) => {
      console.log('Retro session deleted successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['retro-sessions'] });
    },
    onError: (error) => {
      console.error('Failed to delete retro session:', error);
    }
  });
};

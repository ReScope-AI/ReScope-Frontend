import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addRetroSessionParticipant,
  createRetroSession,
  deleteRetroSession,
  downloadRetroSession,
  getInvitedRetroSessions,
  getRetroSessions
} from '@/config/api/retro-session';
import { isDev } from '@/lib/env';
import { ICreateRetroSession, IInviteToRetro } from '@/types';

type GetRetroSessionResponse = {
  data: {
    retroSessions: {
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

    retroSessionParticipants: {
      _id: string;
      session_id: string;
      participants: {
        _id: string;
        name: string;
        email: string;
        created_at: string;
        updated_at: string;
      }[];
      created_at: string;
      updated_at: string;
    }[];
  };
};

export const useCreateRetroSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateRetroSession) => createRetroSession(data),
    onSuccess: (data) => {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.log('Retro session created successfully:', data);
      }

      // Invalidate and refetch retro sessions
      queryClient.invalidateQueries({ queryKey: ['retro-sessions'] });
    },
    onError: (error) => {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.error('Failed to create retro session:', error);
      }
    }
  });
};

export const useGetRetroSessions = () => {
  return useQuery<GetRetroSessionResponse>({
    queryKey: ['retro-sessions'],
    queryFn: getRetroSessions,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
};

export const useGetInvitedRetroSessions = () => {
  return useQuery<GetRetroSessionResponse>({
    queryKey: ['invited-retro-sessions'],
    queryFn: getInvitedRetroSessions,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
};

export const useDeleteRetroSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRetroSession(id),
    onSuccess: (data) => {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.log('Retro session deleted successfully:', data);
      }
      queryClient.invalidateQueries({ queryKey: ['retro-sessions'] });
    },
    onError: (error) => {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.error('Failed to delete retro session:', error);
      }
    }
  });
};

export const useInviteToRetro = () => {
  return useMutation({
    mutationFn: (data: IInviteToRetro) => {
      return addRetroSessionParticipant(data);
    }
  });
};

export const useDownloadRetroSession = () => {
  return useMutation({
    mutationFn: (id: string) => downloadRetroSession(id)
  });
};

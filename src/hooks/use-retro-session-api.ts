import {
  createRetroSession,
  getRetroSessions,
  ICreateRetroSession
} from '@/config/api/retro-session';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateRetroSession = () => {
  return useMutation({
    mutationFn: (data: ICreateRetroSession) => createRetroSession(data),
    onSuccess: (data) => {
      console.log('Retro session created successfully:', data);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};

export const useGetRetroSessions = () => {
  return useQuery({
    queryKey: ['retro-sessions'],
    queryFn: getRetroSessions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

import {
  createSprint,
  deleteSprint,
  getSprintsByUser,
  ICreateSprint
} from '@/config/api/sprint';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCreateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateSprint) => createSprint(data),
    onSuccess: (data) => {
      console.log('Sprint created successfully:', data);
      // Invalidate and refetch sprints
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
    onError: (error) => {
      console.error('Failed to create sprint:', error);
    }
  });
};

export const useGetSprintsByUser = () => {
  return useQuery({
    queryKey: ['sprints'],
    queryFn: getSprintsByUser,
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - data kept in cache for 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true // Refetch when component mounts
  });
};

export const useDeleteSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sprintId: string) => deleteSprint(sprintId),
    onSuccess: (data) => {
      console.log('Sprint deleted successfully:', data);
      // Invalidate and refetch sprints
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
    onError: (error) => {
      console.error('Failed to delete sprint:', error);
    }
  });
};

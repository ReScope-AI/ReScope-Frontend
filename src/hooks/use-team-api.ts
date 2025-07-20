import {
  createTeam,
  deleteTeam,
  getTeams,
  ICreateTeam
} from '@/config/api/team';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateTeam) => createTeam(data),
    onSuccess: (data) => {
      console.log('Team created successfully:', data);
      // Invalidate and refetch teams
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (error) => {
      console.error('Failed to create team:', error);
    }
  });
};

export const useGetTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),
    onSuccess: (data) => {
      console.log('Team deleted successfully:', data);
      // Invalidate and refetch teams
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (error) => {
      console.error('Failed to delete team:', error);
    }
  });
};

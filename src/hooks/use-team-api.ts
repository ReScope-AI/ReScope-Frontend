/* eslint-disable no-console */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTeam,
  deleteTeam,
  getTeams,
  ICreateTeam
} from '@/config/api/team';
import { QUERY_CONSTANTS } from '@/constants/query';
import { useRetrospectiveStore } from '@/features/retrospectives/stores';

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
      // eslint-disable-next-line no-console
      console.error('Failed to create team:', error);
    }
  });
};

export const useGetTeams = () => {
  return useQuery({
    queryKey: [QUERY_CONSTANTS.TEAM.GET_TEAMS],
    queryFn: getTeams,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true // Refetch when component mounts
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  const retroStore = useRetrospectiveStore();

  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),
    onSuccess: (data, teamId) => {
      console.log('Team deleted successfully:', data);
      // Invalidate and refetch teams
      retroStore.removeTeam(teamId);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (error) => {
      console.error('Failed to delete team:', error);
    }
  });
};

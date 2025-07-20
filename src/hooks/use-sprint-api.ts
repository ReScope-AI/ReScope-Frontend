import { createSprint, getSprints, ICreateSprint } from '@/config/api/sprint';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateSprint = () => {
  return useMutation({
    mutationFn: (data: ICreateSprint) => createSprint(data),
    onSuccess: (data) => {
      console.log('Sprint created successfully:', data);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};

export const useGetSprints = () => {
  return useQuery({
    queryKey: ['sprints'],
    queryFn: getSprints,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

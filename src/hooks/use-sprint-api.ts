import { createSprint, getSprints, ICreateSprint } from '@/config/api/sprint';
import { useMutation } from '@tanstack/react-query';

export const useCreateSprint = () => {
  const createSprintMutation = useMutation({
    mutationFn: (data: ICreateSprint) => createSprint(data),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    createSprintMutation
  };
};

export const useGetSprints = () => {
  const getSprintsMutation = useMutation({
    mutationFn: getSprints,
    onSuccess: (data) => {
      console.log(data);
    }
  });
};

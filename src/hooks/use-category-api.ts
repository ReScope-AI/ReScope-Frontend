import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@/config/api/category';

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
    // staleTime: 5 * 60 * 1000,
    // gcTime: 10 * 60 * 1000,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true
  });
};

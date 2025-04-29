import { useQuery } from '@tanstack/react-query';
import { getUserTabOrder } from '../functions/user-preferences';

interface UseGetUserTabOrderProps {
  userId: string;
  pageName: string;
  enabled?: boolean;
}

/**
 * Hook to fetch user's preferred tab order for a specific page
 */
export function useGetUserTabOrder({ 
  userId, 
  pageName, 
  enabled = true 
}: UseGetUserTabOrderProps) {
  const { data: tabOrder, isLoading, error } = useQuery({
    queryKey: ['userTabOrder', userId, pageName],
    queryFn: () => getUserTabOrder(userId, pageName),
    enabled: enabled && !!userId && !!pageName,
  });

  return {
    tabOrder,
    isLoading,
    error,
  };
}

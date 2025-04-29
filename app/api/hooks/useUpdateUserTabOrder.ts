import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserTabOrder } from '../functions/user-preferences';

interface UpdateUserTabOrderProps {
  userId: string;
  pageName: string;
  onSuccess?: (data: string[]) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to update user's preferred tab order for a specific page
 */
export function useUpdateUserTabOrder({ 
  userId,
  pageName,
  onSuccess,
  onError
}: UpdateUserTabOrderProps) {
  const queryClient = useQueryClient();

  const { mutate: updateTabOrder, isPending } = useMutation({
    mutationFn: (tabOrder: string[]) => updateUserTabOrder(userId, { pageName, tabOrder }),
    onSuccess: (data) => {
      // Invalidate and refetch the tab order query
      queryClient.invalidateQueries({ queryKey: ['userTabOrder', userId, pageName] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('Error updating tab order:', error);
      onError?.(error);
    },
  });

  return {
    updateTabOrder,
    isLoading: isPending,
  };
}

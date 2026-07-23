import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/apiClient';

export const useVerifyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.verify,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['auth'],
        exact: false,
      });
    },
  });
};

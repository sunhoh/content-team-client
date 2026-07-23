import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api, FigmaGenerateRequest } from '@/api/apiClient';

export const useFigmaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: FigmaGenerateRequest) => api.figmaGenerate(req),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['figma'],
        exact: false,
      });
    },
  });
};

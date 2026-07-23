import { useMutation } from '@tanstack/react-query';

import { api, GeneratePosterRequest } from '@/api/apiClient';
import { useTask } from '@/contexts/TaskContext';
import { PosterResult } from '@/types';

interface PosterMutationParams extends GeneratePosterRequest {
  taskId: string;
}

export const usePosterMutation = () => {
  const { updateTask } = useTask();

  return useMutation({
    mutationFn: ({ taskId: _, ...params }: PosterMutationParams) =>
      api.generatePoster(params) as Promise<{ data: PosterResult }>,
    onSuccess: (res, { taskId }) => {
      if (res.data) {
        updateTask(taskId, {
          status: 'completed',
          stage: '완료',
          progress: 100,
          result: res.data,
        });
      } else {
        updateTask(taskId, {
          status: 'failed',
          stage: '오류 발생',
          progress: 0,
        });
      }
    },
    onError: (_, { taskId }) => {
      updateTask(taskId, { status: 'failed', stage: '연결 오류', progress: 0 });
    },
  });
};

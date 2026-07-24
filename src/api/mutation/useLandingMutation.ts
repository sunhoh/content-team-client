import { useMutation } from '@tanstack/react-query';

import { api, GenerateLandingRequest } from '@/api/apiClient';
import { useTask } from '@/contexts/TaskContext';
import { LandingResult } from '@/types';

interface LandingMutationParams extends GenerateLandingRequest {
  taskId: string;
}

export const useLandingMutation = () => {
  const { updateTask } = useTask();

  return useMutation({
    mutationFn: ({ taskId: _, ...params }: LandingMutationParams) =>
      api.generateLanding(params) as Promise<{ data: LandingResult }>,
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

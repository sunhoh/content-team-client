import { useMutation } from '@tanstack/react-query';

import { api, GeneratePostRequest } from '@/api/apiClient';
import { useTask } from '@/contexts/TaskContext';
import { BlogResult } from '@/types';

interface PostMutationParams extends GeneratePostRequest {
  taskId: string;
}

export const usePostMutation = () => {
  const { updateTask } = useTask();

  return useMutation({
    mutationFn: ({ taskId: _, ...params }: PostMutationParams) =>
      api.generatePost(params) as Promise<{ data: BlogResult }>,
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

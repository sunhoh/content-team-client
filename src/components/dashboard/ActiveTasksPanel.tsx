'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AgentAvatar } from '@/components/agent/AgentAvatar';
import { LiveBadge, StatusBadge } from '@/components/ui/Badge';
import { IconClock } from '@/components/ui/Icons';
import { agentConfigs } from '@/configs/agent.config';
import { Path, QueryParams, WorkTab } from '@/constants/path.constants';
import { useTask } from '@/contexts/TaskContext';
import { AgentId, Task, TaskStatus } from '@/types';

const agentTypeLabel: Record<string, string> = {
  blog: 'AI 생성 · 블로그',
  poster: 'AI 생성 · 포스터',
};

export function ActiveTasksPanel() {
  const { tasks: blogTasks } = useTask();
  const router = useRouter();

  const tasks: Task[] = blogTasks.slice(0, 6).map(t => ({
    id: t.id,
    title: t.topic,
    type:
      agentTypeLabel[
        agentConfigs[t.agentId as AgentId.David | AgentId.Nova]?.type
      ] ?? 'AI 생성',
    assignee: t.agentId as AgentId,
    status: (t.status === 'completed'
      ? 'complete'
      : t.status === 'processing'
        ? 'in-progress'
        : 'waiting') as TaskStatus,
    time:
      t.status === 'completed'
        ? '완료'
        : t.status === 'processing'
          ? '진행중'
          : '대기',
  }));

  const handleClick = (id: string) => {
    const blogTask = blogTasks.find(t => t.id === id);
    if (blogTask?.status === 'completed' && blogTask.result) {
      router.push(
        `${Path.WORKS}?${QueryParams.TAB}=${WorkTab.REPORT}&${QueryParams.ID}=${id}`,
      );
    }
  };

  return (
    <div className='bg-base neu-raised flex flex-col overflow-hidden rounded-2xl'>
      {/* Header */}
      <div className='border-line-dim flex items-center justify-between border-b px-5 py-3.5'>
        <div className='flex items-center gap-2'>
          <h2 className='text-ink-dim text-xs font-semibold tracking-widest uppercase'>
            Active Tasks
          </h2>
          <LiveBadge />
        </div>
        <Link
          href={`${Path.WORKS}?${QueryParams.TAB}=${WorkTab.STATUS}`}
          className='text-ink-faint hover:text-ink-dim text-xs transition-colors'
        >
          전체보기 →
        </Link>
      </div>

      {/* Task list */}
      <div className='flex-1 scrollbar-thin overflow-y-auto'>
        {tasks.length === 0 ? (
          <div className='text-ink-faint flex items-center justify-center py-10 text-xs'>
            진행 중인 작업이 없습니다
          </div>
        ) : (
          tasks.map((task, i) => {
            const blogTask = blogTasks.find(t => t.id === task.id);
            const isClickable =
              blogTask?.status === 'completed' && !!blogTask.result;
            return (
              <div
                key={task.id}
                onClick={() => handleClick(task.id)}
                className={`hover:bg-overlay flex items-center gap-3 px-3 py-3 transition-colors sm:gap-4 sm:px-5 sm:py-3.5 ${
                  i !== tasks.length - 1 ? 'border-line-dim border-b' : ''
                } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <AgentAvatar agentId={task.assignee} size='sm' />

                <div className='min-w-0 flex-1'>
                  <p className='text-ink truncate text-sm font-medium'>
                    {task.title}
                  </p>
                  <p className='text-ink-faint mt-0.5 text-xs'>{task.type}</p>
                </div>

                <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
                  <StatusBadge status={task.status} />
                  <div className='text-ink-faint hidden items-center gap-1 sm:flex'>
                    <IconClock className='h-3 w-3' />
                    <span className='text-xs'>{task.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AgentAvatar } from '@/components/agent/AgentAvatar';
import { NewTaskModal } from '@/components/modal/NewTaskModal';
import { StatusBadge } from '@/components/ui/Badge';
import { agentConfigs } from '@/configs/agent.config';
import { Path, QueryParams } from '@/constants/path.constants';
import { CHANNEL_COLORS, TASK_FILTERS } from '@/constants/works.constants';
import { useTask } from '@/contexts/TaskContext';
import { AgentId, ContentTask, TaskStatus } from '@/types';

type WorkItem = {
  id: string;
  title: string;
  type: string;
  channel: string;
  assignee: AgentId;
  status: TaskStatus;
  time: string;
  dueDate: string;
  blogTask: ContentTask;
};

function toWorkItem(t: ContentTask): WorkItem {
  const config = agentConfigs[t.agentId as keyof typeof agentConfigs];
  return {
    id: t.id,
    title: t.topic,
    type: config?.role ?? t.agentId,
    channel: t.agentId === AgentId.David ? '블로그' : '포스터',
    assignee: t.agentId as AgentId,
    status: t.status === 'processing' ? 'in-progress' : 'complete',
    time: new Date(t.createdAt).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    dueDate: new Date(t.createdAt).toLocaleDateString('ko-KR'),
    blogTask: t,
  };
}

function ProgressBadge({ task }: { task: ContentTask }) {
  if (task.status === 'failed') {
    return (
      <span className='bg-forge/10 text-forge border-forge/20 inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium'>
        오류
      </span>
    );
  }
  return (
    <span className='bg-sky/10 text-sky border-sky/20 inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium'>
      <span className='bg-sky h-1.5 w-1.5 animate-pulse rounded-full' />
      {task.progress}%
    </span>
  );
}

export default function TasksView() {
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const { tasks, deleteTask } = useTask();
  const router = useRouter();

  const items: WorkItem[] = tasks.map(toWorkItem);
  const filtered =
    activeFilter === 'all'
      ? items
      : items.filter(w => w.status === activeFilter);
  const counts = {
    all: items.length,
    'in-progress': items.filter(w => w.status === 'in-progress').length,
    waiting: items.filter(w => w.status === 'waiting').length,
    complete: items.filter(w => w.status === 'complete').length,
  };

  return (
    <main className='flex-1 scrollbar-thin overflow-y-auto px-5 py-5'>
      <div className='mb-5 flex items-end justify-between'>
        <div>
          <p className='text-ink-faint mb-1 text-[10px] font-bold tracking-[.12em] uppercase'>
            Content Work
          </p>
          <h1 className='text-ink text-xl font-bold'>콘텐츠 작업 현황</h1>
        </div>
      </div>

      <div className='mb-4 flex items-center gap-2'>
        {TASK_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === value
                ? 'neu-inset bg-base text-violet'
                : 'neu-raised-xs bg-base text-ink-faint hover:text-ink-dim'
            }`}
          >
            {label}
            <span
              className={`rounded px-1 py-0.5 text-[10px] font-bold ${
                activeFilter === value
                  ? 'bg-violet/15 text-violet'
                  : 'bg-overlay text-ink-faint'
              }`}
            >
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      <div className='bg-base neu-raised overflow-hidden rounded-2xl'>
        {filtered.map((item, i) => {
          const isClickable =
            item.blogTask.status === 'completed' && !!item.blogTask.result;
          const isProcessing = item.blogTask.status === 'processing';
          return (
            <div
              key={item.id}
              onClick={() => {
                if (!isClickable) return;
                router.push(`${Path.WORKS}?${QueryParams.ID}=${item.id}`);
              }}
              className={`group hover:bg-surface flex items-center gap-4 px-5 py-4 transition-colors ${
                i !== filtered.length - 1 ? 'border-line-dim border-b' : ''
              } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <AgentAvatar
                agentId={item.assignee}
                size='sm'
                status={isProcessing ? 'processing' : undefined}
              />

              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <p className='text-ink truncate text-sm font-medium'>
                    {item.title}
                  </p>
                  {isClickable && (
                    <span className='text-ink-faint shrink-0 text-[10px] opacity-0 transition-opacity group-hover:opacity-100'>
                      결과 보기 →
                    </span>
                  )}
                </div>
                <p className='text-ink-faint mt-0.5 text-xs'>{item.type}</p>
              </div>

              <span
                className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${CHANNEL_COLORS[item.channel] ?? 'text-ink-faint bg-overlay'}`}
              >
                {item.channel}
              </span>

              <div className='w-14 shrink-0 text-right'>
                <p className='text-ink-faint text-[10px]'>{item.dueDate}</p>
              </div>

              <div className='flex shrink-0 items-center gap-2'>
                {isProcessing || item.blogTask.status === 'failed' ? (
                  <ProgressBadge task={item.blogTask} />
                ) : (
                  <StatusBadge status={item.status} />
                )}
                {!isProcessing && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteTask(item.id);
                    }}
                    className='neu-raised-xs bg-base text-ink-faint hover:text-forge flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100'
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className='text-ink-faint flex flex-col items-center justify-center py-16'>
            <svg
              viewBox='0 0 24 24'
              className='mb-3 h-8 w-8 opacity-30'
              fill='none'
              stroke='currentColor'
              strokeWidth={1.5}
            >
              <path
                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <p className='text-sm'>작업이 없습니다</p>
          </div>
        )}
      </div>

      <div className='mt-4 grid grid-cols-3 gap-3'>
        {[
          { label: '진행중', count: counts['in-progress'], color: 'text-sky' },
          { label: '대기중', count: counts.waiting, color: 'text-ink-dim' },
          { label: '완료', count: counts.complete, color: 'text-violet' },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            className='bg-base neu-raised flex items-center gap-3 rounded-xl p-4'
          >
            <div className='bg-base neu-raised-xs flex h-8 w-8 items-center justify-center rounded-lg'>
              <span className={`text-sm font-bold ${color}`}>{count}</span>
            </div>
            <p className='text-ink-faint text-xs'>{label}</p>
          </div>
        ))}
      </div>

      <NewTaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
      />
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';

import { agentConfigs } from '@/configs/agent.config';
import { useTask } from '@/contexts/TaskContext';

export function StatusBar() {
  const { tasks } = useTask();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const processingTasks = mounted
    ? tasks.filter(t => t.status === 'processing')
    : [];
  const runningCount = processingTasks.length;
  const activeAgentIds = mounted ? [...new Set(tasks.map(t => t.agentId))] : [];

  return (
    <footer className='border-line-dim bg-sidebar flex h-8 shrink-0 items-center gap-4 border-t px-4'>
      {/* User */}
      <div className='bg-violet/30 border-violet/40 text-violet-pale flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold'>
        M
      </div>

      <div className='bg-line h-3.5 w-px' />

      {/* 실행 중인 태스크 */}
      {processingTasks.length > 0 ? (
        <div className='flex items-center gap-4'>
          {processingTasks.map(task => {
            const config =
              agentConfigs[task.agentId as keyof typeof agentConfigs];
            if (!config) return null;
            return (
              <div key={task.id} className='flex items-center gap-1.5'>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${config.bgColorClass.replace('/10', '')} animate-pulse`}
                />
                <span
                  className={`text-[10px] font-medium ${config.textColorClass}`}
                >
                  {config.name}
                </span>
                <span className='text-ink-faint max-w-32 truncate text-[10px]'>
                  {task.topic}
                </span>
                {task.progress > 0 && (
                  <span className='text-ink-dim text-[10px] font-semibold'>
                    {task.progress}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <span className='text-ink-faint text-[10px]'>대기 중</span>
      )}

      <div className='flex-1' />

      {/* 활성 에이전트 dots */}
      <div className='flex items-center gap-1.5'>
        {Object.values(agentConfigs).map(config => {
          const isActive = activeAgentIds.includes(config.id);
          return (
            <span
              key={config.id}
              title={config.name}
              className={`h-1.5 w-1.5 rounded-full ${config.bgColorClass.replace('/10', '')} ${isActive ? 'opacity-100' : 'opacity-30'}`}
            />
          );
        })}
      </div>

      <div className='bg-line h-3.5 w-px' />

      {/* 시스템 상태 */}
      {runningCount > 0 ? (
        <div className='flex items-center gap-1'>
          <span className='bg-online h-1.5 w-1.5 animate-pulse rounded-full' />
          <span className='text-online text-[10px] font-medium'>
            {runningCount} running
          </span>
        </div>
      ) : (
        <div className='flex items-center gap-1'>
          <span className='bg-line h-1.5 w-1.5 rounded-full' />
          <span className='text-ink-faint text-[10px]'>idle</span>
        </div>
      )}
      <span className='text-ink-faint text-[10px]'>
        {activeAgentIds.length} agents active
      </span>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AgentAvatar } from "@/components/agent/AgentAvatar";
import { StatusBadge, LiveBadge } from "@/components/ui/Badge";
import { IconClock } from "@/components/ui/Icons";
import { Task, AgentId, TaskStatus } from "@/types";
import { useTask } from "@/contexts/TaskContext";
import { Path, QueryParams, WorkTab } from "@/constants/path.constants";

export function ActiveTasksPanel() {
  const { tasks: blogTasks } = useTask();
  const router = useRouter();

  const tasks: Task[] = blogTasks.slice(0, 6).map((t) => ({
    id: t.id,
    title: t.topic,
    type: 'AI 생성 · 블로그',
    assignee: t.agentId as AgentId,
    status: (t.status === 'completed' ? 'complete' : t.status === 'processing' ? 'in-progress' : 'waiting') as TaskStatus,
    time: t.status === 'completed' ? '완료' : t.status === 'processing' ? '진행중' : '대기',
  }));

  const handleClick = (id: string) => {
    const blogTask = blogTasks.find((t) => t.id === id);
    if (blogTask?.status === 'completed' && blogTask.result) {
      router.push(`${Path.WORKS}?${QueryParams.TAB}=${WorkTab.REPORT}&${QueryParams.ID}=${id}`);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-base neu-raised overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line-dim px-5 py-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold tracking-widest text-ink-dim uppercase">
            Active Tasks
          </h2>
          <LiveBadge />
        </div>
        <Link href={`${Path.WORKS}?${QueryParams.TAB}=${WorkTab.STATUS}`} className="text-xs text-ink-faint hover:text-ink-dim transition-colors">
          전체보기 →
        </Link>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-xs text-ink-faint">
            진행 중인 작업이 없습니다
          </div>
        ) : tasks.map((task, i) => {
          const blogTask = blogTasks.find((t) => t.id === task.id);
          const isClickable = blogTask?.status === 'completed' && !!blogTask.result;
          return (
            <div
              key={task.id}
              onClick={() => handleClick(task.id)}
              className={`flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-3.5 transition-colors hover:bg-overlay ${
                i !== tasks.length - 1 ? "border-b border-line-dim" : ""
              } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <AgentAvatar agentId={task.assignee} size="sm" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {task.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-faint">{task.type}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 sm:gap-3">
                <StatusBadge status={task.status} />
                <div className="hidden sm:flex items-center gap-1 text-ink-faint">
                  <IconClock className="h-3 w-3" />
                  <span className="text-xs">{task.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

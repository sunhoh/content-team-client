'use client';

import { BookOpen, Check, Copy, Image, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { AgentAvatar } from '@/components/agent/AgentAvatar';
import { StatusBar } from '@/components/layouts/ui/StatusBar';
import { TopBar } from '@/components/layouts/ui/TopBar';
import { NewTaskModal } from '@/components/modal/NewTaskModal';
import { StatusBadge } from '@/components/ui/Badge';
import { Path, QueryParams, WorkTab } from '@/constants/path.constants';
import { CHANNEL_COLORS, TASK_FILTERS } from '@/constants/works.constants';
import { useTask } from '@/contexts/TaskContext';
import { AgentId, BlogResult, BlogTask, TaskStatus } from '@/types';

/* ── Tasks 탭 ───────────────────────────────────────────────────── */

function ProgressBadge({ task }: { task: BlogTask }) {
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

function TasksView() {
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const { tasks: blogTasks, deleteTask } = useTask();
  const router = useRouter();

  const blogToTaskStatus = (s: BlogTask['status']): TaskStatus =>
    s === 'completed'
      ? 'complete'
      : s === 'processing'
        ? 'in-progress'
        : 'waiting';

  const allItems = blogTasks.map(t => ({
    id: t.id,
    title: t.topic,
    type: 'AI 생성 · 블로그',
    channel: '블로그',
    assignee: t.agentId as AgentId,
    status: blogToTaskStatus(t.status),
    time:
      t.status === 'completed'
        ? '완료'
        : t.status === 'failed'
          ? '오류'
          : t.stage,
    dueDate: new Date(t.createdAt)
      .toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
      .replace(/\.\s*/g, '.')
      .replace(/\.$/, ''),
    blogTask: t,
  }));

  const filtered =
    activeFilter === 'all'
      ? allItems
      : allItems.filter(w => w.status === activeFilter);

  const counts = {
    all: allItems.length,
    'in-progress': allItems.filter(w => w.status === 'in-progress').length,
    waiting: allItems.filter(w => w.status === 'waiting').length,
    complete: allItems.filter(w => w.status === 'complete').length,
  };

  const handleRowClick = (item: (typeof allItems)[0]) => {
    if (item.blogTask?.status === 'completed' && item.blogTask.result) {
      router.push(
        `${Path.WORKS}?${QueryParams.TAB}=${WorkTab.REPORT}&${QueryParams.ID}=${item.blogTask.id}`,
      );
    }
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
            item.blogTask?.status === 'completed' && !!item.blogTask.result;
          const isProcessing = item.blogTask?.status === 'processing';
          return (
            <div
              key={item.id}
              onClick={() => handleRowClick(item)}
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
                {isProcessing && item.blogTask ? (
                  <ProgressBadge task={item.blogTask} />
                ) : item.blogTask?.status === 'failed' ? (
                  <ProgressBadge task={item.blogTask} />
                ) : (
                  <StatusBadge status={item.status} />
                )}
                {item.status === 'complete' && (
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

/* ── Report 탭 ──────────────────────────────────────────────────── */

function MarkdownContent({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className='text-ink space-y-3 text-sm leading-relaxed'>
      {lines.map((line, i) => {
        if (line.startsWith('# '))
          return (
            <h1 key={i} className='text-ink mt-2 mb-1 text-xl font-bold'>
              {line.slice(2)}
            </h1>
          );
        if (line.startsWith('## '))
          return (
            <h2
              key={i}
              className='text-ink border-line-dim mt-5 mb-1 border-t pt-3 text-base font-semibold'
            >
              {line.slice(3)}
            </h2>
          );
        if (line.startsWith('<!-- TAGS:')) {
          const tags = line
            .replace('<!-- TAGS:', '')
            .replace('-->', '')
            .trim()
            .split(',');
          return (
            <div key={i} className='flex flex-wrap gap-1.5 pt-3'>
              {tags.map((tag, j) => (
                <span
                  key={j}
                  className='bg-violet/10 text-violet rounded-full px-2.5 py-0.5 text-[11px] font-medium'
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          );
        }
        if (!line.trim()) return <div key={i} className='h-1' />;
        return (
          <p key={i} className='text-ink-dim'>
            {line}
          </p>
        );
      })}
    </div>
  );
}

function ImagePromptCard({ block }: { block: string }) {
  const [copied, setCopied] = useState(false);
  const lines = block.trim().split('\n');
  const title = lines[0]?.replace(/^##\s*/, '') ?? '';
  const prompt = lines.slice(1).join('\n').trim();
  if (!prompt) return null;
  return (
    <div className='bg-base neu-raised-sm space-y-2 rounded-2xl p-4'>
      <div className='flex items-center justify-between'>
        <p className='text-violet text-[11px] font-bold tracking-widest uppercase'>
          {title}
        </p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
          className='text-ink-faint neu-raised-xs hover:text-ink-dim flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors'
        >
          {copied ? (
            <Check size={11} className='text-online' />
          ) : (
            <Copy size={11} />
          )}
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <p className='text-ink-dim bg-surface rounded-xl px-3 py-2.5 font-mono text-xs leading-relaxed'>
        {prompt}
      </p>
    </div>
  );
}

function ReportView() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get(QueryParams.ID);
  const { tasks } = useTask();
  const [contentTab, setContentTab] = useState<'content' | 'images'>('content');
  const [task, setTask] = useState<BlogTask | null>(null);

  useEffect(() => {
    if (taskId) {
      const found = tasks.find(
        t => t.id === taskId && t.status === 'completed' && t.result,
      );
      setTask(found ?? null);
    } else {
      setTask(null);
    }
  }, [taskId, tasks]);

  useEffect(() => {
    setContentTab('content');
  }, [taskId]);

  if (!task) {
    return (
      <main className='text-ink-faint flex flex-1 flex-col items-center justify-center gap-3'>
        <BookOpen size={32} className='opacity-20' />
        <p className='text-sm'>보고서를 선택해주세요</p>
        <p className='text-xs'>
          작업 현황에서 완료된 항목을 클릭하면 여기에 표시됩니다
        </p>
      </main>
    );
  }

  return (
    <main className='flex flex-1 flex-col overflow-hidden'>
      <div className='border-line-dim flex shrink-0 items-start gap-3 border-b px-6 pt-5 pb-4'>
        <div className='bg-base neu-raised-sm text-violet mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl'>
          <BookOpen size={14} />
        </div>
        <div className='min-w-0 flex-1'>
          <h2 className='text-ink truncate text-base font-semibold'>
            {task.topic}
          </h2>
          <p className='text-ink-faint mt-0.5 text-[11px]'>
            블로그 · {new Date(task.createdAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
      </div>

      <div className='border-line-dim flex shrink-0 items-center gap-1 border-b px-6 py-3'>
        <button
          onClick={() => setContentTab('content')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            contentTab === 'content'
              ? 'neu-inset bg-base text-violet'
              : 'neu-raised-xs bg-base text-ink-faint hover:text-ink-dim'
          }`}
        >
          <BookOpen size={12} /> 본문
        </button>
        <button
          onClick={() => setContentTab('images')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            contentTab === 'images'
              ? 'neu-inset bg-base text-violet'
              : 'neu-raised-xs bg-base text-ink-faint hover:text-ink-dim'
          }`}
        >
          <Image size={12} /> 이미지 프롬프트
        </button>
      </div>

      <div className='flex-1 scrollbar-thin overflow-y-auto px-6 py-5'>
        {contentTab === 'content' ? (
          <MarkdownContent text={(task.result as BlogResult).content} />
        ) : (
          <div className='space-y-3'>
            {(task.result as BlogResult).imagePrompts
              .split(/\n(?=##\s)/)
              .filter(Boolean)
              .map((block: string, i: number) => (
                <ImagePromptCard key={i} block={block} />
              ))}
          </div>
        )}
      </div>
    </main>
  );
}

/* ── 페이지 ─────────────────────────────────────────────────────── */

function WorkContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get(QueryParams.TAB);
  return tab === WorkTab.REPORT ? <ReportView /> : <TasksView />;
}

export default function WorkPage() {
  return (
    <>
      <TopBar />
      <WorkContent />
      <StatusBar />
    </>
  );
}

'use client';

import {
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Image,
  Palette,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { AgentAvatar } from '@/components/agent/AgentAvatar';
import { agentConfigs } from '@/configs/agent.config';
import { Path, QueryParams, WorkTab } from '@/constants/path.constants';
import { useTask } from '@/contexts/TaskContext';
import { BlogResult, ContentTask, PosterResult } from '@/types';

function MarkdownContent({ text }: { text: string }) {
  const lines = (text ?? '').split('\n');
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

function BlogReportView({ task }: { task: ContentTask }) {
  const [contentTab, setContentTab] = useState<'content' | 'images'>('content');
  const result = task.result as BlogResult | undefined;

  return (
    <main className='flex flex-1 flex-col overflow-hidden'>
      <div className='border-line-dim flex shrink-0 items-start gap-3 border-b px-6 pt-5 pb-4'>
        <div className='bg-base neu-raised-sm text-violet mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl'>
          <BookOpen size={14} />
        </div>
        <div className='min-w-0 flex-1'>
          <h2 className='text-ink truncate text-sm font-semibold'>
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
          <MarkdownContent text={result?.content ?? ''} />
        ) : (
          <div className='space-y-3'>
            {(result?.imagePrompts ?? '')
              .split(/\n(?=##\s)/)
              .filter(Boolean)
              .map((block, i) => (
                <ImagePromptCard key={i} block={block} />
              ))}
          </div>
        )}
      </div>
    </main>
  );
}

function PosterReportView({ task }: { task: ContentTask }) {
  const [copied, setCopied] = useState(false);
  const result = task.result as PosterResult | undefined;

  return (
    <main className='flex flex-1 flex-col overflow-hidden'>
      <div className='border-line-dim flex shrink-0 items-start gap-3 border-b px-6 pt-5 pb-4'>
        <div className='bg-base neu-raised-sm text-nova mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl'>
          <Palette size={14} />
        </div>
        <div className='min-w-0 flex-1'>
          <h2 className='text-ink truncate text-sm font-semibold'>
            {task.topic}
          </h2>
          <p className='text-ink-faint mt-0.5 text-[11px]'>
            포스터 · {new Date(task.createdAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
        {result?.figmaUrl && (
          <a
            href={result.figmaUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='neu-raised-xs bg-base text-ink-faint hover:text-ink-dim flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors'
          >
            <ExternalLink size={11} /> Figma에서 열기
          </a>
        )}
      </div>

      <div className='flex-1 scrollbar-thin overflow-y-auto px-6 py-5'>
        <div className='space-y-4'>
          {result?.imageUrl ? (
            <div className='bg-base neu-raised overflow-hidden rounded-2xl'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.imageUrl}
                alt={task.topic}
                className='h-auto w-full object-contain'
              />
            </div>
          ) : (
            <div className='text-ink-faint bg-base neu-raised flex h-48 items-center justify-center rounded-2xl'>
              <p className='text-sm'>이미지를 불러올 수 없습니다</p>
            </div>
          )}

          {result?.imagePrompt && (
            <div className='bg-base neu-raised-sm space-y-2 rounded-2xl p-4'>
              <div className='flex items-center justify-between'>
                <p className='text-nova text-[11px] font-bold tracking-widest uppercase'>
                  Image Prompt
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.imagePrompt);
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
                {result.imagePrompt}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ReportListView() {
  const { tasks } = useTask();
  const router = useRouter();
  const completed = tasks.filter(t => t.status === 'completed' && t.result);

  return (
    <main className='flex-1 scrollbar-thin overflow-y-auto px-5 py-5'>
      <div className='mb-5'>
        <p className='text-ink-faint mb-1 text-[10px] font-bold tracking-[.12em] uppercase'>
          Reports
        </p>
        <h1 className='text-ink text-xl font-bold'>보고서</h1>
      </div>

      <div className='bg-base neu-raised overflow-hidden rounded-2xl'>
        {completed.map((task, i) => {
          const config = agentConfigs[task.agentId as keyof typeof agentConfigs];
          const isPoster = config?.type === 'poster';
          return (
            <div
              key={task.id}
              onClick={() =>
                router.push(
                  `${Path.WORKS}?${QueryParams.TAB}=${WorkTab.REPORT}&${QueryParams.ID}=${task.id}`,
                )
              }
              className={`group hover:bg-surface flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors ${
                i !== completed.length - 1 ? 'border-line-dim border-b' : ''
              }`}
            >
              <AgentAvatar agentId={task.agentId as never} size='sm' />

              <div className='min-w-0 flex-1'>
                <p className='text-ink truncate text-sm font-medium'>
                  {task.topic}
                </p>
                <p className='text-ink-faint mt-0.5 text-xs'>{config?.role ?? task.agentId}</p>
              </div>

              <span
                className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${
                  isPoster
                    ? 'bg-nova/10 text-nova'
                    : 'bg-violet/10 text-violet'
                }`}
              >
                {isPoster ? '포스터' : '블로그'}
              </span>

              <div className='w-20 shrink-0 text-right'>
                <p className='text-ink-faint text-[10px]'>
                  {new Date(task.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>

              <span className='text-ink-faint text-[10px] opacity-0 transition-opacity group-hover:opacity-100'>
                열기 →
              </span>
            </div>
          );
        })}

        {completed.length === 0 && (
          <div className='text-ink-faint flex flex-col items-center justify-center py-16'>
            <BookOpen size={28} className='mb-3 opacity-20' />
            <p className='text-sm'>완료된 작업이 없습니다</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ReportView() {
  const searchParams = useSearchParams();
  const { tasks } = useTask();
  const taskId = searchParams.get(QueryParams.ID);
  const task = taskId ? (tasks.find(t => t.id === taskId) ?? null) : null;

  if (!task) return <ReportListView />;

  const config = agentConfigs[task.agentId as keyof typeof agentConfigs];
  if (config?.type === 'poster') return <PosterReportView task={task} />;
  return <BlogReportView task={task} />;
}

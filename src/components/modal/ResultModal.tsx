'use client';

import {
  BookOpen,
  Check,
  Copy,
  Download,
  ExternalLink,
  Image,
  Loader2,
  Palette,
  RefreshCw,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { dispatchAgent } from '@/api/agentDispatch';
import { useFigmaMutation } from '@/api/mutation/useFigmaMutation';
import { usePosterMutation } from '@/api/mutation/usePosterMutation';
import { useTask } from '@/contexts/TaskContext';
import { useTenant } from '@/contexts/TenantContext';
import { AgentId, BlogResult, ContentTask, PosterResult } from '@/types';

interface ResultModalProps {
  task: ContentTask | null;
  onClose: () => void;
}

type Tab = 'content' | 'images';

function isBlogResult(result: BlogResult | PosterResult): result is BlogResult {
  return 'content' in result;
}

function MarkdownContent({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className='text-ink space-y-3 text-sm leading-relaxed'>
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return (
            <h1 key={i} className='text-ink mt-2 mb-1 text-xl font-bold'>
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2
              key={i}
              className='text-ink border-line-dim mt-5 mb-1 border-t pt-3 text-base font-semibold'
            >
              {line.slice(3)}
            </h2>
          );
        }
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

function ImagePromptCard({
  block,
  onGenerate,
}: {
  block: string;
  onGenerate: (prompt: string) => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const lines = block.trim().split('\n');
  const title = lines[0]?.replace(/^##\s*/, '') ?? '';
  const prompt = lines.slice(1).join('\n').trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await onGenerate(prompt);
    setGenerating(false);
    setDone(true);
  };

  if (!prompt) return null;

  return (
    <div className='bg-base neu-raised-sm space-y-2 rounded-2xl p-4'>
      <div className='flex items-center justify-between'>
        <p className='text-violet text-[11px] font-bold tracking-widest uppercase'>
          {title}
        </p>
        <div className='flex items-center gap-1.5'>
          <button
            onClick={handleGenerate}
            disabled={generating || done}
            className='text-nova neu-raised-xs hover:bg-nova/5 flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors disabled:opacity-50'
          >
            {generating ? (
              <Loader2 size={11} className='animate-spin' />
            ) : done ? (
              <Check size={11} className='text-online' />
            ) : (
              <Palette size={11} />
            )}
            {generating ? '생성 중' : done ? '전송됨' : 'Nova로 생성'}
          </button>
          <button
            onClick={handleCopy}
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
      </div>
      <p className='text-ink-dim bg-surface rounded-xl px-3 py-2.5 font-mono text-xs leading-relaxed'>
        {prompt}
      </p>
    </div>
  );
}

function ImagePromptsContent({ text }: { text: string }) {
  const { addTask, updateTask } = useTask();
  const { tenantId } = useTenant();
  const blocks = text.split(/\n(?=##\s)/).filter(Boolean);

  const handleGenerate = async (prompt: string) => {
    const taskId = crypto.randomUUID();
    const task: ContentTask = {
      id: taskId,
      topic: prompt,
      agentId: AgentId.Nova,
      status: 'processing',
      stage: '이미지 생성 중',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    addTask(task);

    const result = await dispatchAgent({
      agentId: AgentId.Nova,
      topic: prompt,
      tenant: tenantId,
      imageType: 'poster',
      posterSize: 'vertical',
    });

    if (result.data) {
      updateTask(taskId, {
        status: 'completed',
        progress: 100,
        result: result.data,
      });
    } else {
      updateTask(taskId, { status: 'failed', stage: '생성 실패' });
    }
  };

  if (!blocks.length) {
    return (
      <p className='text-ink-faint py-8 text-center text-sm'>
        이미지 프롬프트가 없습니다.
      </p>
    );
  }
  return (
    <div className='space-y-3'>
      {blocks.map((block, i) => (
        <ImagePromptCard key={i} block={block} onGenerate={handleGenerate} />
      ))}
    </div>
  );
}

function PosterResultView({ result, task }: { result: PosterResult; task: ContentTask }) {
  const { updateTask } = useTask();
  const { tenantId } = useTenant();
  const [figmaUrl, setFigmaUrl] = useState(result.figmaUrl ?? null);

  const { mutate: regenerate, isPending: isRegenerating } = usePosterMutation();
  const { mutate: exportFigma, isPending: isExporting } = useFigmaMutation();

  const handleRegenerate = () => {
    const newTaskId = crypto.randomUUID();
    updateTask(task.id, { status: 'processing', stage: '재생성 중...', progress: 0, result: undefined });
    regenerate({
      taskId: task.id,
      topic: task.topic,
      tenant: tenantId,
      imageType: task.imageType,
      language: 'ko',
    });
  };

  const handleFigmaExport = () => {
    exportFigma(
      {
        imageType: task.imageType ?? 'poster',
        topic: task.topic,
        tenant: tenantId,
        spec: result.spec as unknown as Record<string, unknown>,
        imagePrompt: result.imagePrompt,
        imageUrl: result.imageUrl,
      },
      {
        onSuccess: (res) => {
          if (res.data?.figmaUrl) {
            setFigmaUrl(res.data.figmaUrl);
            updateTask(task.id, { result: { ...result, figmaUrl: res.data.figmaUrl } });
          }
        },
      },
    );
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      {result.imageUrl ? (
        <img
          src={result.imageUrl}
          alt='생성된 포스터'
          className='w-full rounded-2xl object-contain'
        />
      ) : (
        <div className='bg-surface flex aspect-[3/4] w-full items-center justify-center rounded-2xl'>
          <p className='text-ink-faint text-sm'>이미지를 불러올 수 없습니다.</p>
        </div>
      )}
      <div className='flex w-full flex-col gap-2'>
        <div className='flex w-full gap-2'>
          {result.imageUrl && (
            <a
              href={result.imageUrl}
              download
              className='neu-raised-sm bg-base text-ink-dim hover:text-ink flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-colors'
            >
              <Download size={14} />
              PNG 다운로드
            </a>
          )}
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className='neu-raised-sm bg-base text-ink-dim hover:text-ink flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-colors disabled:opacity-50'
          >
            {isRegenerating ? (
              <Loader2 size={14} className='animate-spin' />
            ) : (
              <RefreshCw size={14} />
            )}
            이미지 재생성
          </button>
        </div>
        {figmaUrl ? (
          <a
            href={figmaUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='neu-btn-accent bg-base text-violet flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold'
          >
            <ExternalLink size={14} />
            Figma에서 열기
          </a>
        ) : (
          <button
            onClick={handleFigmaExport}
            disabled={isExporting}
            className='neu-btn-accent bg-base text-violet flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold disabled:opacity-50'
          >
            {isExporting ? (
              <Loader2 size={14} className='animate-spin' />
            ) : (
              <ExternalLink size={14} />
            )}
            {isExporting ? 'Figma 내보내는 중...' : 'Figma로 내보내기'}
          </button>
        )}
      </div>
    </div>
  );
}

export function ResultModal({ task, onClose }: ResultModalProps) {
  const [tab, setTab] = useState<Tab>('content');

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (task) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKey);
      setTab('content');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [task, handleKey]);

  if (!task || !task.result) return null;

  const result = task.result;
  const isPoster = !isBlogResult(result);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='bg-ink/40 absolute inset-0 backdrop-blur-xs'
        onClick={onClose}
      />

      <div
        className={`bg-base relative flex max-h-[88vh] flex-col overflow-hidden rounded-3xl ${isPoster ? 'w-[480px]' : 'w-[680px]'}`}
      >
        {/* Header */}
        <div className='flex shrink-0 items-start gap-3 px-6 pt-6 pb-4'>
          <div className='bg-base neu-raised-sm text-violet mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl'>
            {isPoster ? <Image size={14} /> : <BookOpen size={14} />}
          </div>
          <div className='min-w-0 flex-1'>
            <h2 className='text-ink truncate text-base font-semibold'>
              {task.topic}
            </h2>
            <p className='text-ink-faint mt-0.5 text-[11px]'>
              {isPoster ? 'Nova · 포스터' : '블로그 · Aria'} ·{' '}
              {new Date(task.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <button
            onClick={onClose}
            className='bg-base neu-btn-icon text-ink-faint hover:text-ink-dim flex h-8 w-8 shrink-0 items-center justify-center rounded-xl'
          >
            <X size={14} />
          </button>
        </div>

        {/* Blog tabs */}
        {!isPoster && (
          <div className='border-line-dim flex shrink-0 items-center gap-1 border-b px-6 pb-3'>
            <button
              onClick={() => setTab('content')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === 'content'
                  ? 'neu-inset bg-base text-violet'
                  : 'neu-raised-xs bg-base text-ink-faint hover:text-ink-dim'
              }`}
            >
              <BookOpen size={12} />
              본문
            </button>
            <button
              onClick={() => setTab('images')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === 'images'
                  ? 'neu-inset bg-base text-violet'
                  : 'neu-raised-xs bg-base text-ink-faint hover:text-ink-dim'
              }`}
            >
              <Image size={12} />
              이미지 프롬프트
            </button>
          </div>
        )}

        {/* Body */}
        <div className='flex-1 scrollbar-thin overflow-y-auto px-6 py-5'>
          {isPoster ? (
            <PosterResultView result={result as PosterResult} task={task} />
          ) : tab === 'content' ? (
            <MarkdownContent text={(result as BlogResult).content} />
          ) : (
            <ImagePromptsContent text={(result as BlogResult).imagePrompts} />
          )}
        </div>
      </div>
    </div>
  );
}

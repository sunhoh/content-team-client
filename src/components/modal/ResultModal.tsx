'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, BookOpen, Image, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { BlogTask, BlogResult, PosterResult } from '@/types';

interface ResultModalProps {
  task: BlogTask | null;
  onClose: () => void;
}

type Tab = 'content' | 'images';

function isBlogResult(result: BlogResult | PosterResult): result is BlogResult {
  return 'content' in result;
}

function MarkdownContent({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-xl font-bold text-ink mt-2 mb-1">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-base font-semibold text-ink mt-5 mb-1 pt-3 border-t border-line-dim">{line.slice(3)}</h2>;
        }
        if (line.startsWith('<!-- TAGS:')) {
          const tags = line.replace('<!-- TAGS:', '').replace('-->', '').trim().split(',');
          return (
            <div key={i} className="flex flex-wrap gap-1.5 pt-3">
              {tags.map((tag, j) => (
                <span key={j} className="rounded-full bg-violet/10 px-2.5 py-0.5 text-[11px] font-medium text-violet">
                  {tag.trim()}
                </span>
              ))}
            </div>
          );
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        return <p key={i} className="text-ink-dim">{line}</p>;
      })}
    </div>
  );
}

function ImagePromptCard({ block }: { block: string }) {
  const [copied, setCopied] = useState(false);
  const lines = block.trim().split('\n');
  const title = lines[0]?.replace(/^##\s*/, '') ?? '';
  const prompt = lines.slice(1).join('\n').trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!prompt) return null;

  return (
    <div className="rounded-2xl bg-base neu-raised-sm p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold tracking-widest uppercase text-violet">{title}</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-ink-faint neu-raised-xs hover:text-ink-dim transition-colors"
        >
          {copied ? <Check size={11} className="text-online" /> : <Copy size={11} />}
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <p className="text-xs text-ink-dim leading-relaxed font-mono bg-surface rounded-xl px-3 py-2.5">
        {prompt}
      </p>
    </div>
  );
}

function ImagePromptsContent({ text }: { text: string }) {
  const blocks = text.split(/\n(?=##\s)/).filter(Boolean);
  if (!blocks.length) {
    return <p className="text-sm text-ink-faint text-center py-8">이미지 프롬프트가 없습니다.</p>;
  }
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => <ImagePromptCard key={i} block={block} />)}
    </div>
  );
}

function PosterResultView({ result }: { result: PosterResult }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {result.imageUrl ? (
        <img
          src={result.imageUrl}
          alt="생성된 포스터"
          className="w-full rounded-2xl object-contain"
        />
      ) : (
        <div className="w-full aspect-[3/4] rounded-2xl bg-surface flex items-center justify-center">
          <p className="text-sm text-ink-faint">이미지를 불러올 수 없습니다.</p>
        </div>
      )}
      <div className="flex gap-2 w-full">
        {result.imageUrl && (
          <a
            href={result.imageUrl}
            download
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold neu-raised-sm bg-base text-ink-dim hover:text-ink transition-colors"
          >
            <Download size={14} />
            PNG 다운로드
          </a>
        )}
        {result.figmaUrl && (
          <a
            href={result.figmaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold neu-btn-accent bg-base text-violet"
          >
            <ExternalLink size={14} />
            Figma에서 열기
          </a>
        )}
      </div>
    </div>
  );
}

export function ResultModal({ task, onClose }: ResultModalProps) {
  const [tab, setTab] = useState<Tab>('content');

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-xs" onClick={onClose} />

      <div className={`relative max-h-[88vh] rounded-3xl bg-base overflow-hidden flex flex-col ${isPoster ? 'w-[480px]' : 'w-[680px]'}`}>
        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-6 pb-4 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-base neu-raised-sm text-violet shrink-0 mt-0.5">
            {isPoster ? <Image size={14} /> : <BookOpen size={14} />}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-ink truncate">{task.topic}</h2>
            <p className="text-[11px] text-ink-faint mt-0.5">
              {isPoster ? 'Nova · 포스터' : '블로그 · Aria'} · {new Date(task.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-base neu-btn-icon text-ink-faint hover:text-ink-dim"
          >
            <X size={14} />
          </button>
        </div>

        {/* Blog tabs */}
        {!isPoster && (
          <div className="flex items-center gap-1 px-6 pb-3 shrink-0 border-b border-line-dim">
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
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
          {isPoster ? (
            <PosterResultView result={result as PosterResult} />
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

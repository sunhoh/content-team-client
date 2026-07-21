import { TaskStatus } from '@/types';

export const CHANNEL_COLORS: Record<string, string> = {
  '블로그':     'text-violet bg-violet/10',
  '인스타그램': 'text-rose bg-rose/10',
  '이메일':     'text-sky bg-sky/10',
  '내부 문서':  'text-ink-dim bg-overlay',
  '보고서':     'text-teal bg-teal/10',
  '전체 채널':  'text-amber bg-amber/10',
};

export const TASK_FILTERS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: '전체',   value: 'all' },
  { label: '진행중', value: 'in-progress' },
  { label: '대기',   value: 'waiting' },
  { label: '완료',   value: 'complete' },
];

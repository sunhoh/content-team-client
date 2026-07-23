'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';

export function ApiTab() {
  const { apiKey, login } = useAuth();
  const [showCurrentKey, setShowCurrentKey] = useState(false);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!newKey.trim()) return;
    try {
      await login(newKey.trim());
      setNewKey('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success('API 키가 저장되었습니다.');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : '유효하지 않은 API 키입니다.',
      );
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <section className='bg-base neu-raised rounded-2xl p-6'>
        <div className='mb-5 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-base neu-raised-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'>
              <svg
                viewBox='0 0 24 24'
                className='text-teal h-5 w-5'
                fill='none'
                stroke='currentColor'
                strokeWidth={1.5}
              >
                <circle cx='8' cy='15' r='4' />
                <path d='M12 15h8M18 13v4' strokeLinecap='round' />
              </svg>
            </div>
            <div>
              <p className='text-ink text-sm font-bold'>Claude API Key</p>
              <p className='text-ink-faint mt-0.5 text-xs'>
                Anthropic Console에서 발급
              </p>
            </div>
          </div>
          <div className='text-online flex items-center gap-1.5 text-xs font-semibold'>
            <span className='bg-online h-1.5 w-1.5 rounded-full' />
            인증됨
          </div>
        </div>

        <label className='text-ink-faint mb-2 block text-[10.5px] font-bold tracking-[.08em] uppercase'>
          현재 키
        </label>
        <div className='relative mb-4'>
          <input
            type={showCurrentKey ? 'text' : 'password'}
            readOnly
            value={apiKey ?? ''}
            className='neu-input bg-base text-ink-dim w-full rounded-xl px-4 py-3 pr-12 font-mono text-sm'
          />
          <button
            type='button'
            onClick={() => setShowCurrentKey(v => !v)}
            className='neu-btn-icon bg-base text-ink-faint absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg'
          >
            {showCurrentKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <label className='text-ink-faint mb-2 block text-[10.5px] font-bold tracking-[.08em] uppercase'>
          새 키로 교체
        </label>
        <div className='flex items-center gap-2'>
          <div className='relative flex-1'>
            <input
              type={showNewKey ? 'text' : 'password'}
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder='sk-ant-api03-...'
              className='neu-input bg-base text-ink w-full rounded-xl px-4 py-3 pr-12 font-mono text-sm'
            />
            <button
              type='button'
              onClick={() => setShowNewKey(v => !v)}
              className='neu-btn-icon bg-base text-ink-faint absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg'
            >
              {showNewKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={!newKey.trim()}
            className='neu-btn-accent shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40'
            style={{
              background: saved
                ? 'linear-gradient(135deg, #16a34a, #15803d)'
                : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            }}
          >
            {saved ? '저장됨 ✓' : '저장'}
          </button>
        </div>
      </section>

      <section className='bg-base neu-raised rounded-2xl p-6'>
        <div className='mb-5 flex items-center gap-3'>
          <div className='bg-base neu-raised-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'>
            <svg
              viewBox='0 0 24 24'
              className='text-violet h-5 w-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={1.5}
            >
              <path
                d='M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z'
                strokeLinejoin='round'
              />
              <path
                d='M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div>
            <p className='text-ink text-sm font-bold'>기본 모델</p>
            <p className='text-ink-faint mt-0.5 text-xs'>
              에이전트 실행에 사용할 Claude 모델
            </p>
          </div>
        </div>

        <div className='bg-violet/5 flex items-start gap-2 rounded-xl px-4 py-3'>
          <svg
            viewBox='0 0 24 24'
            className='text-violet mt-0.5 h-3.5 w-3.5 shrink-0'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
          >
            <circle cx='12' cy='12' r='10' />
            <path d='M12 16v-4M12 8h.01' strokeLinecap='round' />
          </svg>
          <p className='text-ink-faint text-xs leading-relaxed'>
            각 에이전트에는 서브 에이전트가 수행할 LLM 모델이 사전에 지정되어
            있습니다.
          </p>
        </div>
      </section>

      <div className='bg-base neu-raised flex items-center gap-3 rounded-2xl px-5 py-4'>
        <svg
          viewBox='0 0 24 24'
          className='text-teal h-4 w-4 shrink-0'
          fill='none'
          stroke='currentColor'
          strokeWidth={1.5}
        >
          <path
            d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
            strokeLinejoin='round'
          />
        </svg>
        <p className='text-ink-faint text-xs'>
          API 키는 브라우저 로컬 스토리지에만 저장되며 외부 서버로 전송되지
          않습니다.
        </p>
      </div>
    </div>
  );
}

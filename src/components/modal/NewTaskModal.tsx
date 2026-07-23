'use client';

import { Play, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { usePostMutation } from '@/api/mutation/usePostMutation';
import { usePosterMutation } from '@/api/mutation/usePosterMutation';
import { AgentOptions } from '@/components/modal/ui/AgentOptions';
import { SelectAgents } from '@/components/modal/ui/SelectAgents';
import { TopicInput } from '@/components/modal/ui/TopicInput';
import { AGENTS } from '@/constants/agent.constants';
import {
  DEFAULT_PERSONA,
  DEFAULT_PLATFORM,
  Persona,
  Platform,
} from '@/constants/agents/blog.constants';
import {
  ContentType,
  DEFAULT_CONTENT_TYPE,
  DEFAULT_IMAGE_TYPE,
  DEFAULT_POSTER_SIZE,
  ImageType,
  PosterSizeType,
} from '@/constants/agents/poster.constants';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { useTenant } from '@/contexts/TenantContext';

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
  initialAgentId?: string;
  initialTopic?: string;
}

export function NewTaskModal({
  open,
  onClose,
  initialAgentId,
  initialTopic,
}: NewTaskModalProps) {
  const [selectedId, setSelectedId] = useState(initialAgentId ?? AGENTS[0].id);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<Persona>(DEFAULT_PERSONA);
  const [platform, setPlatform] = useState<Platform>(DEFAULT_PLATFORM);
  const [imageType, setImageType] = useState<ImageType>(DEFAULT_IMAGE_TYPE);
  const [contentType, setContentType] = useState<ContentType>(DEFAULT_CONTENT_TYPE);
  const [posterSize, setPosterSize] = useState<PosterSizeType>(DEFAULT_POSTER_SIZE);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addTask } = useTask();
  const { apiKey } = useAuth();
  const { tenantId } = useTenant();
  const { mutate: generatePost } = usePostMutation();
  const { mutate: generatePoster } = usePosterMutation();

  const selected = AGENTS.find(a => a.id === selectedId)!;
  const isBlog = selectedId === 'david';

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setSelectedId(initialAgentId ?? AGENTS[0].id);
      setInput(initialTopic ?? '');
      setTimeout(() => textareaRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
      setInput('');
      setPersona(DEFAULT_PERSONA);
      setPlatform(DEFAULT_PLATFORM);
      setImageType(DEFAULT_IMAGE_TYPE);
      setContentType(DEFAULT_CONTENT_TYPE);
      setPosterSize(DEFAULT_POSTER_SIZE);
      setImageFile(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, initialAgentId, initialTopic]);

  const onSubmit = () => {
    if (!input.trim() || !apiKey) return;

    const id = crypto.randomUUID();
    addTask({
      id,
      topic: input.trim(),
      agentId: selectedId,
      status: 'processing',
      stage: '생성 중...',
      progress: 0,
      createdAt: new Date().toISOString(),
      imageType: selectedId !== 'david' ? imageType : undefined,
    });

    onClose();

    const commonParams = { taskId: id, topic: input.trim(), tenant: tenantId, language: 'ko' };

    if (selectedId === 'david') {
      generatePost({ ...commonParams, persona, platform });
    } else {
      generatePoster({
        ...commonParams,
        imageType,
        contentType: imageType === 'thumbnail' ? contentType : undefined,
        posterSize: imageType === 'poster' ? posterSize : undefined,
        image: imageFile || undefined,
      });
    }
  };

  if (!open) return null;

  return (
    <>
      <div className='fixed inset-0 z-[60] flex items-center justify-center'>
        <div
          className='bg-ink/40 absolute inset-0 backdrop-blur-xs'
          onClick={onClose}
        />

        <div className='bg-base relative h-[83vh] w-[480px] overflow-hidden rounded-3xl'>
          <div className='scrollbar-modal h-full overflow-y-auto'>
            {/* 헤더 */}
            <div className='flex items-center gap-3 px-6 pt-6 pb-5'>
              <div className='bg-base neu-raised-sm text-violet flex h-8 w-8 items-center justify-center rounded-xl'>
                <Plus size={15} />
              </div>
              <h2 className='text-ink text-base font-semibold'>새 작업</h2>
              <button
                onClick={onClose}
                className='bg-base neu-btn-icon text-ink-faint hover:text-ink-dim ml-auto flex h-8 w-8 items-center justify-center rounded-xl'
              >
                <X size={14} />
              </button>
            </div>

            <div className='space-y-5 px-6 pb-6'>
              {/* 에이전트 선택 */}
              <SelectAgents selectedId={selectedId} onSelect={setSelectedId} />
              <div className='bg-line-dim h-px' />
              {/* 에이전트 전용 옵션 */}
              <AgentOptions
                selectedId={selectedId}
                persona={persona}
                platform={platform}
                onPersonaChange={setPersona}
                onPlatformChange={setPlatform}
                imageType={imageType}
                onImageTypeChange={setImageType}
                contentType={contentType}
                onContentTypeChange={setContentType}
                posterSize={posterSize}
                onPosterSizeChange={setPosterSize}
                imageFile={imageFile}
                onImageChange={setImageFile}
              />
              {/* 주제 입력 */}
              <TopicInput
                value={input}
                onChange={setInput}
                textareaRef={textareaRef}
                agentName={selected.name}
                agentTextColorClass={selected.textColorClass}
                isBlog={isBlog}
              />
              {/* 실행 버튼 */}
              <button
                onClick={onSubmit}
                disabled={!input.trim() || !apiKey}
                className='neu-btn-accent bg-base text-violet flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40'
              >
                <Play
                  size={13}
                  className={`fill-current ${selected.textColorClass}`}
                />
                <span>{selected.name} 실행</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

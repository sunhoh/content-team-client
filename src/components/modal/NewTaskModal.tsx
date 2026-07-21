'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play, Plus } from 'lucide-react';

import { useTask } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { AGENTS } from '@/constants/agent.constants';
import { AgentOptions } from '@/components/modal/ui/AgentOptions';
import { SelectAgents } from '@/components/modal/ui/SelectAgents';
import { TopicInput } from '@/components/modal/ui/TopicInput';
import { dispatchAgent } from '@/api/agentDispatch';
import { Persona, Platform, DEFAULT_PERSONA, DEFAULT_PLATFORM } from '@/constants/agents/blog.constants';
import { ThumbnailType, DEFAULT_THUMBNAIL_TYPE, PosterSizeType, DEFAULT_POSTER_SIZE, ContentType, DEFAULT_CONTENT_TYPE } from '@/constants/agents/poster.constants';

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
  initialAgentId?: string;
}

export function NewTaskModal({ open, onClose, initialAgentId }: NewTaskModalProps) {
  const [selectedId, setSelectedId] = useState(initialAgentId ?? AGENTS[0].id);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<Persona>(DEFAULT_PERSONA);
  const [platform, setPlatform] = useState<Platform>(DEFAULT_PLATFORM);
  const [contentType, setContentType] = useState<ContentType>(DEFAULT_CONTENT_TYPE);
  const [thumbnailType, setThumbnailType] = useState<ThumbnailType>(DEFAULT_THUMBNAIL_TYPE);
  const [posterSize, setPosterSize] = useState<PosterSizeType>(DEFAULT_POSTER_SIZE);
  const [image, setImage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addTask, updateTask } = useTask();
  const { apiKey } = useAuth();
  const { tenantId } = useTenant();

  const selected = AGENTS.find((a) => a.id === selectedId)!;
  const isBlog = selectedId === 'david';

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setSelectedId(initialAgentId ?? AGENTS[0].id);
      setTimeout(() => textareaRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
      setInput('');
      setPersona(DEFAULT_PERSONA);
      setPlatform(DEFAULT_PLATFORM);
      setContentType(DEFAULT_CONTENT_TYPE);
      setThumbnailType(DEFAULT_THUMBNAIL_TYPE);
      setPosterSize(DEFAULT_POSTER_SIZE);
      setImage('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, initialAgentId]);

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
    });

    onClose();

    dispatchAgent({
      agentId: selectedId,
      topic: input.trim(),
      tenant: tenantId,
      persona,
      platform,
      contentType,
      thumbnailType,
      posterSize,
      image: image || undefined,
    })
      .then((json) => {
        if (json.success && json.data) {
          updateTask(id, { status: 'completed', stage: '완료', progress: 100, result: json.data });
        } else {
          updateTask(id, { status: 'failed', stage: '오류 발생', progress: 0 });
        }
      })
      .catch(() => updateTask(id, { status: 'failed', stage: '연결 오류', progress: 0 }));
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-ink/40 backdrop-blur-xs"
          onClick={onClose}
        />

        <div className="relative w-[480px] max-h-[90vh] rounded-3xl bg-base overflow-hidden">
        <div className="scrollbar-modal h-full max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="flex items-center gap-3 px-6 pt-6 pb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-base neu-raised-sm text-violet">
              <Plus size={15} />
            </div>
            <h2 className="text-base font-semibold text-ink">새 작업</h2>
            <button
              onClick={onClose}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-xl bg-base neu-btn-icon text-ink-faint hover:text-ink-dim"
            >
              <X size={14} />
            </button>
          </div>

          <div className="px-6 pb-6 space-y-5">

            {/* 에이전트 선택 */}
            <SelectAgents selectedId={selectedId} onSelect={setSelectedId} />
            <div className="h-px bg-line-dim" />
            {/* 에이전트 전용 옵션 */}
            <AgentOptions
              selectedId={selectedId}
              persona={persona}
              platform={platform}
              onPersonaChange={setPersona}
              onPlatformChange={setPlatform}
              contentType={contentType}
              onContentTypeChange={setContentType}
              thumbnailType={thumbnailType}
              onThumbnailTypeChange={setThumbnailType}
              posterSize={posterSize}
              onPosterSizeChange={setPosterSize}
              image={image}
              onImageChange={setImage}
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
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed neu-btn-accent bg-base text-violet enabled:cursor-pointer"
            >
              <Play size={13} className={`fill-current ${selected.textColorClass}`} />
              <span>{selected.name} 실행</span>
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

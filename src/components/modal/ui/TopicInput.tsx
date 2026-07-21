'use client';

import { RefObject } from 'react';

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  agentName: string;
  agentTextColorClass: string;
  isBlog: boolean;
}

export function TopicInput({ value, onChange, textareaRef, agentName, agentTextColorClass, isBlog }: TopicInputProps) {
  return (
    <div>
      <p className="mb-3 font-mono text-[10.5px] font-semibold tracking-widest text-ink-faint uppercase">
        주제 입력
        <span className="normal-case tracking-normal font-normal">— </span>
        <span className={`normal-case tracking-normal font-medium ${agentTextColorClass}`}>
          {agentName}에게 전달
        </span>
      </p>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={
          isBlog
            ? `블로그 주제를 입력하세요\n예) 여름철 자외선 차단제 올바른 사용법`
            : `${agentName}에게 무엇을 시킬까요?\n예) 최근 AI 트렌드 조사해서 요약해줘`
        }
        className="w-full resize-none rounded-2xl bg-base px-4 py-3 text-sm text-ink placeholder:text-ink-faint neu-input"
      />
      <p className="mt-2 text-[10.5px] text-ink-faint">⌘ .....</p>
    </div>
  );
}

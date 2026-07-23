'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Persona,
  PERSONA_OPTIONS,
  Platform,
  PLATFORM_OPTIONS,
} from '@/constants/agents/blog.constants';

interface BlogOptionsProps {
  persona: Persona;
  platform: Platform;
  onPersonaChange: (value: Persona) => void;
  onPlatformChange: (value: Platform) => void;
}

export function BlogOptions({
  persona,
  platform,
  onPersonaChange,
  onPlatformChange,
}: BlogOptionsProps) {
  return (
    <div className='space-y-5'>
      <div>
        <p className='text-ink-faint mb-3 font-mono text-[10.5px] font-semibold tracking-widest uppercase'>
          페르소나 선택
        </p>
        <Select
          value={persona}
          onValueChange={v => v && onPersonaChange(v as Persona)}
        >
          <SelectTrigger>
            <span className='text-ink text-sm'>{PERSONA_OPTIONS[persona]}</span>
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(PERSONA_OPTIONS) as [Persona, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      {/* 플랫폼 선택 */}
      <div>
        <p className='text-ink-faint my-3 font-mono text-[10.5px] font-semibold tracking-widest uppercase'>
          플랫폼 선택
        </p>
        <div className='flex gap-2'>
          {(Object.entries(PLATFORM_OPTIONS) as [Platform, string][]).map(
            ([value, label]) => (
              <button
                key={value}
                onClick={() => onPlatformChange(value)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  platform === value
                    ? 'neu-inset text-aria'
                    : 'neu-raised-sm text-ink-dim hover:text-ink'
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

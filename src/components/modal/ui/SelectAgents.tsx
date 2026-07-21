'use client';

import { AGENTS } from '@/constants/agent.constants';

interface SelectAgentsProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SelectAgents({ selectedId, onSelect }: SelectAgentsProps) {
  return (
    <div>
      <p className="mb-3 font-mono text-[10.5px] font-semibold tracking-widest text-ink-faint uppercase">
        에이전트 선택
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        {AGENTS.map((agent) => {
          const isSelected = agent.id === selectedId;
          const Icon = agent.icon;
          return (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className={`flex flex-col items-center gap-2.5 rounded-2xl p-4 transition-all ${
                isSelected
                  ? `neu-inset ${agent.bgColorClass}`
                  : 'neu-raised-sm bg-base hover:bg-surface'
              }`}
            >
              {Icon && (
                <Icon
                  size={20}
                  className={isSelected ? agent.textColorClass : 'text-ink-faint'}
                />
              )}
              <div className="text-center">
                <p className={`text-sm font-semibold ${isSelected ? agent.textColorClass : 'text-ink-dim'}`}>
                  {agent.name}
                </p>
                <p className="mt-0.5 text-[10px] text-ink-faint">{agent.role}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

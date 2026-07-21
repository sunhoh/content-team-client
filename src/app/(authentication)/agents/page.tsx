'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AgentStatus } from '@/types';
import { AGENTS, AgentConfig } from '@/constants/agent.constants';
import {
  IconResearch,
  IconDatabase,
  IconGlobe,
} from '@/components/ui/Icons';
import { LucideIcon } from 'lucide-react';
import { NewTaskModal } from '@/components/modal/NewTaskModal';

const iconMap: Record<string, LucideIcon> = {
  aria:  IconResearch,
  flux:  IconDatabase,
  scout: IconGlobe,
};

const statusConfig: Record<AgentStatus, { label: string; dotClass: string; textClass: string }> = {
  active:     { label: 'ONLINE',  dotClass: 'bg-online',              textClass: 'text-online' },
  processing: { label: 'RUNNING', dotClass: 'bg-amber animate-pulse', textClass: 'text-amber' },
  idle:       { label: 'IDLE',    dotClass: 'bg-ink-faint',           textClass: 'text-ink-faint' },
};

function StatusBadge({ status }: { status: AgentStatus }) {
  const { label, dotClass, textClass } = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-widest ${textClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}

function AgentCard({ agent, onRun }: { agent: AgentConfig; onRun: () => void }) {
  const { id, name, role, status, description, tags, image, textColorClass, bgColorClass } = agent;
  const Icon = iconMap[id] ?? agent.icon;

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-base p-5 neu-raised group hover:scale-[1.01] transition-transform duration-200">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden ${bgColorClass} neu-raised-xs`}>
          {image ? (
            <Image src={image} alt={name} width={40} height={40} className="h-full w-full object-cover" />
          ) : (
            Icon && <Icon className={`h-5 w-5 ${textColorClass}`} />
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-0.5">
        <h2 className="text-xl font-bold leading-tight text-ink">{name}</h2>
        <p className={`text-[10px] font-semibold tracking-widest uppercase ${textColorClass}`}>
          {role}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-ink-dim">{description}</p>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-base px-2.5 py-0.5 text-xs text-ink-dim neu-raised-xs">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-1">
        <button
          onClick={onRun}
          className="flex items-center gap-1 rounded-lg bg-base px-3 py-1.5 text-xs font-semibold text-ink-dim neu-btn transition-colors hover:text-ink"
        >
          RUN
          <span className="text-[10px]">›</span>
        </button>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const onlineCount = AGENTS.filter((a) => a.status === 'active').length;
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>();

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line-dim px-4 py-3 sm:px-6 sm:py-4">
        <div>
          <h1 className="text-base font-semibold text-ink">AI Agents</h1>
          <p className="text-xs text-ink-faint">
            {AGENTS.length} agents &middot; {onlineCount} online
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-online/30 bg-online/10 px-2.5 py-1 text-xs font-mono font-medium text-online">
          <span className="h-1.5 w-1.5 rounded-full bg-online animate-pulse" />
          <span className="hidden sm:inline tracking-widest">SYSTEM </span>ONLINE
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onRun={() => { setSelectedAgentId(agent.id); setTaskModalOpen(true); }}
            />
          ))}
        </div>
      </div>

      <NewTaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} initialAgentId={selectedAgentId} />
    </div>
  );
}

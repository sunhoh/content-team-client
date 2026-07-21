'use client';

import Link from 'next/link';
import { AgentAvatar } from "@/components/agent/AgentAvatar";
import { AgentId } from "@/types";
import { AGENTS } from "@/constants/agent.constants";
import { useTask } from "@/contexts/TaskContext";
import { Path } from "@/constants/path.constants";

const statusLabel: Record<string, string> = {
  active: "활성",
  processing: "처리중",
  idle: "대기",
};

const statusClass: Record<string, string> = {
  active: "text-online",
  processing: "text-amber",
  idle: "text-ink-faint",
};

export function AgentsPanel() {
  const { tasks } = useTask();
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const onlineCount = AGENTS.filter((a) => a.status === 'active').length;

  return (
    <div className="flex flex-col rounded-2xl bg-base neu-raised overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line-dim px-5 py-3.5">
        <h2 className="text-xs font-semibold tracking-widest text-ink-dim uppercase">
          Agents
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-online animate-pulse" />
            <span className="text-xs text-online">
              {onlineCount} online
            </span>
          </div>
          <Link href={Path.AGENTS} className="text-xs text-ink-faint hover:text-ink-dim transition-colors">
            전체보기 →
          </Link>
        </div>
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {AGENTS.map((agent, i) => (
          <div
            key={agent.id}
            className={`flex items-center gap-3 px-5 py-3 transition-colors hover:bg-overlay ${
              i !== AGENTS.length - 1 ? "border-b border-line-dim" : ""
            }`}
          >
            <AgentAvatar agentId={agent.id as AgentId} size="sm" status={agent.status} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{agent.name}</p>
              <p className="text-xs text-ink-faint truncate">{agent.role}</p>
            </div>
            <span className={`text-xs font-medium ${statusClass[agent.status]}`}>
              {statusLabel[agent.status]}
            </span>
          </div>
        ))}
      </div>

      {/* Task stats */}
      <div className="border-t border-line-dim px-5 py-4">
        <p className="mb-3 text-xs font-semibold tracking-widest text-ink-dim uppercase">
          Task
        </p>
        <div className="flex items-end gap-3">
          <div>
            <p className="text-2xl font-bold text-ink">{completedCount}</p>
            <p className="text-[10px] text-ink-faint">COMPLETED</p>
          </div>
          <div className="mb-1 h-px flex-1 bg-line" />
          <div className="text-right">
            <p className="text-lg font-semibold text-ink-dim">{tasks.length}</p>
            <p className="text-[10px] text-ink-faint">TOTAL</p>
          </div>
        </div>
      </div>
    </div>
  );
}

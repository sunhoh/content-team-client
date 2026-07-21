'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AGENTS } from "@/constants/agent.constants";
import { useTask } from "@/contexts/TaskContext";
import { ResultModal } from "@/components/modal/ResultModal";

const teamMembers = AGENTS.filter((a) => a.image || a.icon);

export default function Agents() {
  const { tasks, selectedTask, setSelectedTask } = useTask();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const visibleMembers = teamMembers.filter(({ id }) =>
    tasks.some((t) => t.agentId === id && !dismissed.has(t.id))
  );

  if (!mounted || visibleMembers.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40">
        {visibleMembers.map(({ id, name, image, icon: Icon, bgColorClass, textColorClass }) => {
          const agentTask = tasks.find((t) => t.agentId === id && !dismissed.has(t.id));
          const isProcessing = agentTask?.status === 'processing';
          const isCompleted = agentTask?.status === 'completed' && !!agentTask.result;

          return (
            <div
              key={id}
              onClick={() => {
                if (isCompleted && agentTask) setSelectedTask(agentTask);
              }}
              className={`group flex flex-col items-center gap-1.5 transition-transform duration-200 ease-out hover:scale-125 ${
                isCompleted ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="relative">
                {/* X 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (agentTask) setDismissed((prev) => new Set(prev).add(agentTask.id));
                  }}
                  className="absolute -top-1 -right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-base neu-raised-xs text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity hover:text-ink"
                >
                  <X size={8} strokeWidth={2.5} />
                </button>
                {isCompleted && (
                  <span className="absolute -inset-1 rounded-full border-2 border-online" />
                )}

                {/* SVG 프로그레스 링 */}
                {isProcessing && (() => {
                  const r = 23;
                  const circ = 2 * Math.PI * r;
                  const progress = agentTask.progress ?? 0;
                  return (
                    <svg
                      className="absolute pointer-events-none"
                      style={{ inset: '-6px', width: 'calc(100% + 12px)', height: 'calc(100% + 12px)' }}
                      viewBox="0 0 52 52"
                    >
                      {/* 트랙 */}
                      <circle cx="26" cy="26" r={r} fill="none" strokeWidth="2.5" stroke="var(--color-line-dim)" />
                      {progress > 0 ? (
                        /* 실제 progress 값 있을 때 */
                        <circle
                          cx="26" cy="26" r={r}
                          fill="none"
                          strokeWidth="2.5"
                          stroke="var(--color-sky)"
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          strokeDashoffset={circ * (1 - progress / 100)}
                          transform="rotate(-90 26 26)"
                          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                        />
                      ) : (
                        /* 인디케이터: 아크가 도는 애니메이션 */
                        <circle
                          cx="26" cy="26" r={r}
                          fill="none"
                          strokeWidth="2.5"
                          stroke="var(--color-sky)"
                          strokeLinecap="round"
                          strokeDasharray={`${circ * 0.28} ${circ * 0.72}`}
                          style={{
                            transformOrigin: '26px 26px',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                      )}
                    </svg>
                  );
                })()}

                <div className={`h-10 w-10 rounded-full ${bgColorClass} neu-raised-sm overflow-hidden flex items-center justify-center ${image ? 'p-1' : ''}`}>
                  {image
                    ? <Image src={image} alt={name} width={40} height={40} className="h-full w-full object-cover" />
                    : Icon && <Icon size={20} className={textColorClass} />
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ResultModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  );
}

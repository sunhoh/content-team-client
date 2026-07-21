import { TaskStatus } from "@/types";

const config: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  complete: {
    label: "완료",
    className: "bg-violet/20 text-violet-pale border border-violet/30",
  },
  "in-progress": {
    label: "진행",
    className: "bg-sky/15 text-sky border border-sky/25",
  },
  waiting: {
    label: "대기",
    className: "bg-ink-faint/30 text-ink-dim border border-line",
  },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium text-online">
      <span className="h-1.5 w-1.5 rounded-full bg-online animate-pulse" />
      LIVE
    </span>
  );
}

export function OnlineBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-online/30 bg-online/10 px-2.5 py-0.5 text-xs font-mono font-medium tracking-widest text-online">
      <span className="h-1.5 w-1.5 rounded-full bg-online" />
      SYSTEM ONLINE
    </span>
  );
}

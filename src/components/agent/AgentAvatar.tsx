import { AgentId, AgentStatus } from "@/types";

const agentConfig: Record<
  AgentId,
  { initials: string; colorClass: string; dotClass: string }
> = {
  david: {
    initials: "D",
    colorClass: "bg-aria/20 text-aria border-aria/30",
    dotClass: "bg-aria",
  },
  flux: {
    initials: "F",
    colorClass: "bg-flux/20 text-flux border-flux/30",
    dotClass: "bg-flux",
  },
  scout: {
    initials: "S",
    colorClass: "bg-scout/20 text-scout border-scout/30",
    dotClass: "bg-scout",
  },
  forge: {
    initials: "Fo",
    colorClass: "bg-forge/20 text-forge border-forge/30",
    dotClass: "bg-forge",
  },
  echo: {
    initials: "E",
    colorClass: "bg-echo/20 text-echo border-echo/30",
    dotClass: "bg-echo",
  },
  nexus: {
    initials: "N",
    colorClass: "bg-nexus/20 text-nexus border-nexus/30",
    dotClass: "bg-nexus",
  },
  quill: {
    initials: "Q",
    colorClass: "bg-violet/20 text-violet border-violet/30",
    dotClass: "bg-violet",
  },
  nova: {
    initials: "N",
    colorClass: "bg-nova/20 text-nova border-nova/30",
    dotClass: "bg-nova",
  },
};

const statusDotClass: Record<AgentStatus, string> = {
  active: "bg-online",
  processing: "bg-amber animate-pulse",
  idle: "bg-offline",
};

interface AgentAvatarProps {
  agentId: AgentId;
  size?: "sm" | "md";
  status?: AgentStatus;
}

export function AgentAvatar({
  agentId,
  size = "md",
  status,
}: AgentAvatarProps) {
  const { initials, colorClass, dotClass } = agentConfig[agentId];
  const sizeClass = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={`${sizeClass} ${colorClass} flex items-center justify-center rounded-full border font-semibold`}
      >
        {initials}
      </div>
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${statusDotClass[status]}`}
        />
      )}
      {!status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${dotClass}`}
        />
      )}
    </div>
  );
}

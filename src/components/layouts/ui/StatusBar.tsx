const agentStats = [
  { name: "Flux", label: "Work Processed", value: "67%", color: "bg-flux" },
  { name: "Nexus", label: "Orchestration", value: "97%", color: "bg-nexus" },
  { name: "Scout", label: "Research Active", value: "93%", color: "bg-scout" },
];

const agentDots = [
  { id: "aria", color: "bg-aria" },
  { id: "flux", color: "bg-flux" },
  { id: "scout", color: "bg-scout" },
  { id: "forge", color: "bg-forge" },
  { id: "echo", color: "bg-echo" },
];

export function StatusBar() {
  return (
    <footer className="flex h-8 shrink-0 items-center border-t border-line-dim bg-sidebar px-4 gap-4">
      {/* User */}
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet/30 border border-violet/40 text-[10px] font-semibold text-violet-pale shrink-0">
        M
      </div>

      <div className="h-3.5 w-px bg-line" />

      {/* Agent stats */}
      <div className="flex items-center gap-4">
        {agentStats.map(({ name, label, value, color }) => (
          <div key={name} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
            <span className="text-[10px] font-medium text-ink-dim">{name}</span>
            <span className="text-[10px] text-ink-faint">{label}</span>
            <span className="text-[10px] font-semibold text-ink-dim">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Agent connection dots */}
      <div className="flex items-center gap-1.5">
        {agentDots.map(({ id, color }) => (
          <span
            key={id}
            title={id}
            className={`h-1.5 w-1.5 rounded-full ${color} opacity-80`}
          />
        ))}
      </div>

      <div className="h-3.5 w-px bg-line" />

      {/* System status */}
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-online animate-pulse" />
        <span className="text-[10px] text-online font-medium">1 running</span>
      </div>
      <span className="text-[10px] text-ink-faint">15 agents active</span>
    </footer>
  );
}

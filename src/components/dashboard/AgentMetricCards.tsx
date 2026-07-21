import {
  IconResearch,
  IconAnalyze,
  IconGenerate,
  IconReport,
} from "@/components/ui/Icons";
import { MetricCard } from "@/types";

const cards: MetricCard[] = [
  {
    id: "research",
    label: "RESEARCH",
    sublabel: "Ada · Aria",
    assignee: "david",
    icon: "research",
  },
  {
    id: "analyze",
    label: "ANALYZE",
    sublabel: "Ada · Flux",
    assignee: "flux",
    icon: "analyze",
  },
  {
    id: "generate",
    label: "GENERATE",
    sublabel: "Ada · Scout",
    assignee: "scout",
    icon: "generate",
  },
  {
    id: "report",
    label: "REPORT",
    sublabel: "Ada · Forge",
    assignee: "forge",
    icon: "report",
  },
];

const iconMap = {
  research: IconResearch,
  analyze: IconAnalyze,
  generate: IconGenerate,
  report: IconReport,
};

const iconColorMap = {
  research: "text-violet-soft bg-violet/15",
  analyze: "text-teal bg-teal/10",
  generate: "text-amber bg-amber/10",
  report: "text-sky bg-sky/10",
};

export function AgentMetricCards() {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = iconMap[card.icon];
        const colorClass = iconColorMap[card.icon];
        return (
          <div
            key={card.id}
            className="group flex flex-col gap-3 rounded-2xl bg-base neu-raised p-4 transition-transform duration-200 "
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl neu-raised-xs ${colorClass}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-ink-dim">
                {card.label}
              </p>
              <p className="mt-0.5 text-xs text-ink-faint">{card.sublabel}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

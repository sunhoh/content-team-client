import {
  IconAnalyze,
  IconGenerate,
  IconReport,
  IconResearch,
} from '@/components/ui/Icons';
import { agentConfigs } from '@/configs/agent.config';
import { AgentId, MetricCard } from '@/types';

const cards: MetricCard[] = [
  {
    id: 'research',
    label: 'RESEARCH',
    sublabel: '·',
    assignee: 'david',
    icon: 'research',
  },
  {
    id: 'planner',
    label: 'PLANNER',
    sublabel: '·',
    assignee: 'flux',
    icon: 'analyze',
  },
  {
    id: 'reviewer',
    label: 'REVIEWER',
    sublabel: '·',
    assignee: 'forge',
    icon: 'report',
  },
  {
    id: 'generate',
    label: 'GENERATE',
    sublabel: `${AgentId.David} · ${AgentId.Nova}`,
    assignee: 'scout',
    icon: 'generate',
  },
];

const iconMap = {
  research: IconResearch,
  analyze: IconAnalyze,
  generate: IconGenerate,
  report: IconReport,
};

const iconColorMap = {
  research: 'text-violet-soft bg-violet/15',
  analyze: 'text-teal bg-teal/10',
  generate: 'text-amber bg-amber/10',
  report: 'text-sky bg-sky/10',
};

export function AgentMetricCards() {
  return (
    <div className='mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {cards.map(card => {
        const Icon = iconMap[card.icon];
        const colorClass = iconColorMap[card.icon];
        return (
          <div
            key={card.id}
            className='group bg-base neu-raised flex flex-col gap-3 rounded-2xl p-4 transition-transform duration-200'
          >
            <div
              className={`neu-raised-xs flex h-9 w-9 items-center justify-center rounded-xl ${colorClass}`}
            >
              <Icon className='h-5 w-5' />
            </div>
            <div>
              <p className='text-ink-dim text-[10px] font-semibold tracking-widest'>
                {card.label}
              </p>
              <p className='text-ink-faint mt-0.5 text-xs'>{card.sublabel}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

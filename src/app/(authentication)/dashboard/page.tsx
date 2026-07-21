'use client';

import { ActiveTasksPanel } from '@/components/dashboard/ActiveTasksPanel';
import { AgentMetricCards } from '@/components/dashboard/AgentMetricCards';
import { AgentsPanel } from '@/components/dashboard/AgentsPanel';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { StatusBar } from '@/components/layouts/ui/StatusBar';
import { TopBar } from '@/components/layouts/ui/TopBar';

export default function DashboardPage() {
  return (
    <>
      <main className='flex-1 scrollbar-thin overflow-y-auto px-4 py-6'>
        <WelcomeHero />
        <AgentMetricCards />
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]'>
          <ActiveTasksPanel />
          <AgentsPanel />
        </div>
      </main>
      <StatusBar />
    </>
  );
}

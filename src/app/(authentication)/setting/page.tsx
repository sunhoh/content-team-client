'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ApiTab } from '@/components/setting/ApiTab';
import { WorkspaceTab } from '@/components/setting/WorkspaceTab';

type Tab = 'api' | 'workspace';

const tabs: { key: Tab; label: string }[] = [
  { key: 'api', label: 'API Key' },
  { key: 'workspace', label: 'workspace' },
];

export default function SettingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get('tab') === 'workspace' ? 'workspace' : 'api';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    router.replace(`?tab=${tab}`, { scroll: false });
  };

  return (
    <div className='flex justify-center px-6 py-10'>
      <div className='flex w-full max-w-xl flex-col gap-5'>
        <div className='bg-base neu-inset flex gap-1 rounded-2xl p-1'>
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === key
                  ? 'bg-base neu-raised text-ink'
                  : 'text-ink-faint hover:text-ink-dim'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'api' ? <ApiTab /> : <WorkspaceTab />}
      </div>
    </div>
  );
}

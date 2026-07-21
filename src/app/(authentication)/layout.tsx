import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

import Agents from '@/components/agent/Agents';
import { Sidebar } from '@/components/layouts/ui/Sidebar';

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />
      <div className='m-4 flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#818CF8]/20'>
        <Suspense
          fallback={
            <div className='flex min-h-screen items-center justify-center p-4'>
              <Loader2 size={28} className='animate-spin text-violet-400' />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
      <Agents />
    </div>
  );
}

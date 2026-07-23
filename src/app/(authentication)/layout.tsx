export const dynamic = 'force-dynamic';

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
        {children}
      </div>
      <Agents />
    </div>
  );
}

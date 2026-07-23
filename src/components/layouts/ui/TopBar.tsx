'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { IconBell, IconSearch } from '@/components/ui/Icons';
import { Path, QueryParams, WorkTab } from '@/constants/path.constants';

const tabs = [
  {
    label: '작업 현황',
    href: Path.WORKS,
    isActive: (p: string, t: string | null) =>
      p === Path.WORKS && t !== WorkTab.REPORT,
  },
  // {
  //   label: '보고서',
  //   href: `${Path.WORKS}?${QueryParams.TAB}=${WorkTab.REPORT}`,
  //   isActive: (p: string, t: string | null) =>
  //     p === Path.WORKS && t === WorkTab.REPORT,
  // },
];

export function TopBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get(QueryParams.TAB);

  return (
    <header className='border-line-dim bg-sidebar flex h-11 shrink-0 items-center border-b px-5'>
      <nav className='flex h-full items-end gap-0.5'>
        {tabs.map(({ label, href, isActive }) => {
          const active = isActive(pathname, tab);
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`relative flex h-full items-center px-4 text-xs font-medium transition-colors ${
                active
                  ? 'text-ink after:bg-violet-soft after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px'
                  : 'text-ink-faint hover:text-ink-dim'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div className='flex-1' />

      <div className='flex items-center gap-2'>
        <button className='text-ink-faint hover:bg-overlay hover:text-ink-dim flex h-7 w-7 items-center justify-center rounded-lg transition-colors'>
          <IconSearch className='h-4 w-4' />
        </button>
        <button className='text-ink-faint hover:bg-overlay hover:text-ink-dim relative flex h-7 w-7 items-center justify-center rounded-lg transition-colors'>
          <IconBell className='h-4 w-4' />
          <span className='bg-violet absolute top-1 right-1 h-1.5 w-1.5 rounded-full' />
        </button>
      </div>
    </header>
  );
}

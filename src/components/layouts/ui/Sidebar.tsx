'use client';

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { NewTaskModal } from '@/components/modal/NewTaskModal';
import { MENUS } from '@/constants/menu.constants';
import { Path } from '@/constants/path.constants';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { MENU_KEY } from '@/types/menu.type';

// 사이드바 오른쪽 끝 위치: left margin(16) + width(56) = 72px, 버튼 반폭(10) 빼면 62px
const TOGGLE_LEFT_OPEN = 62;
const TOGGLE_LEFT_CLOSED = 4;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const setting = MENUS[MENU_KEY.SETTING];
  const { isLg } = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // 화면 크기 변화에 따라 자동 동기화
  useEffect(() => {
    setCollapsed(!isLg);
  }, [isLg]);

  // 사이드바 닫힐 때 설정 팝업도 닫기
  useEffect(() => {
    if (collapsed) setMenuOpen(false);
  }, [collapsed]);

  return (
    <>
      {/* 사이드바 */}
      <aside
        className={`bg-base neu-raised relative flex shrink-0 flex-col items-center overflow-hidden rounded-2xl py-5 transition-all duration-300 ease-in-out ${
          mounted && collapsed ? 'pointer-events-none m-0 w-0 opacity-0' : 'm-4 w-14'
        }`}
      >
        {/* New Task */}
        <button
          className='bg-base neu-raised-sm mb-6 flex h-9 w-9 items-center justify-center rounded-xl'
          onClick={() => setTaskModalOpen(true)}
        >
          <Plus size={18} />
        </button>

        <NewTaskModal
          open={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
        />

        {/* Nav */}
        <nav className='flex flex-1 flex-col items-center gap-2'>
          {(Object.keys(MENUS) as MENU_KEY[])
            .filter(k => k !== MENU_KEY.SETTING)
            .map(key => {
              const menu = MENUS[key];
              if (!menu) return null;
              const active = pathname.startsWith(menu.key);
              return (
                <button
                  key={key}
                  title={menu.label}
                  onClick={() => router.push(menu.key)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active
                      ? 'neu-inset bg-base text-violet'
                      : 'neu-btn-icon bg-base text-ink-faint hover:text-ink-dim'
                  }`}
                >
                  {menu.icon}
                </button>
              );
            })}
        </nav>

        {/* User avatar + popup */}
        <div className='relative'>
          {menuOpen && (
            <div className='bg-base neu-raised absolute bottom-0 left-full ml-3 w-24 overflow-hidden rounded-2xl py-2'>
              <button
                title={setting?.label}
                onClick={() => {
                  setting && router.push(setting.key);
                  setMenuOpen(false);
                }}
                className='text-ink-dim hover:text-ink hover:bg-surface flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors'
              >
                {setting?.icon}
                <span>설정</span>
              </button>
            </div>
          )}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className={`bg-base text-violet flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-shadow ${
              menuOpen ? 'neu-inset' : 'neu-raised-xs'
            }`}
          >
            M
          </button>
        </div>
      </aside>

      {/* 토글 화살표 버튼 */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className='bg-base neu-raised-xs text-ink-faint hover:text-ink-dim fixed top-1/2 z-50 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full transition-[left] duration-300 ease-in-out'
        style={{ left: mounted && collapsed ? TOGGLE_LEFT_CLOSED : TOGGLE_LEFT_OPEN }}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </>
  );
}

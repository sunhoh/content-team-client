import {
  BotMessageSquare,
  FileText,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

import { MENU_KEY, MENU_TYPE } from '@/types/menu.type';

import { Path } from './path.constants';

export const MENUS: Partial<Record<MENU_KEY, MENU_TYPE>> = {
  [MENU_KEY.DASHBOARD]: {
    key: Path.DASHBOARD,
    label: 'menu.dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  [MENU_KEY.WORKS]: {
    key: Path.WORKS,
    label: 'menu.work',
    icon: <FileText size={18} />,
  },
  [MENU_KEY.AGENTS]: {
    key: Path.AGENTS,
    label: 'menu.bot',
    icon: <BotMessageSquare size={18} />,
  },
  [MENU_KEY.SETTING]: {
    key: Path.SETTING,
    label: 'menu.setting',
    icon: <Settings size={18} />,
  },
};

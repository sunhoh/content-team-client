import { Path } from '@/constants/path.constants';

export interface MENU_TYPE {
  key: Path;
  label: string;
  icon: React.ReactNode;
  children?: SubMenu[];
}

export enum MENU_KEY {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD',
  WORKS = 'WORKS',
  AGENTS = 'AGENTS',
  SETTING = 'SETTING',
}

export interface SubMenu {
  key: Path;
  label: string;
}

import { MENU_KEY } from '@/types/menu.type';

export enum TenantId {
  GuClinic = 'gu-clinic',
  Luho = 'luho',
}

export interface Tenant {
  id: TenantId;
  allowedMenus?: MENU_KEY[];
  assetsPathname: string;
}

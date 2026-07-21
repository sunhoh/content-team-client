import { MENU_KEY } from '@/types/menu.type';

export enum TenantId {
  Local = 'local',
  GuClinic = 'gu-clinic',
}

export interface Tenant {
  id: TenantId;  
  allowedMenus?: MENU_KEY[];
  assetsPathname: string;
}

import { MENU_KEY } from '@/types/menu.type';
import { Tenant, TenantId } from '@/types/tenant.type';

export const tenantConfigs: Record<TenantId, Tenant> = {
  [TenantId.GuClinic]: {
    id: TenantId.GuClinic,
    assetsPathname: '/gu',
    allowedMenus: [MENU_KEY.HOME, MENU_KEY.DASHBOARD],
  },
  [TenantId.Luho]: {
    id: TenantId.Luho,
    assetsPathname: '/luho',
  },
};

export function getTenantConfig(): Tenant {
  const tenantId = TenantId.GuClinic;
  return tenantConfigs[tenantId] || tenantConfigs[TenantId.GuClinic];
}

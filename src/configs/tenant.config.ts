import { Tenant, TenantId } from '@/types/tenant.type'
import { MENU_KEY } from '@/types/menu.type';

export const tenantConfigs: Record<TenantId, Tenant> = {
    [TenantId.Local]: {
        id: TenantId.Local,
        assetsPathname: '/gu',
      },
      [TenantId.GuClinic]: {
        id: TenantId.GuClinic,
        assetsPathname: '/gu',
        allowedMenus: [
            MENU_KEY.HOME,
            MENU_KEY.DASHBOARD
        ],
      },
}

export function getTenantConfig(): Tenant {
    
    const tenantId = 'gu-clinic';
  
    return tenantConfigs[tenantId] || tenantConfigs[TenantId.GuClinic];
  }
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TenantData {
  tenantId: string;
  tenantName: string;
}

interface TenantContextValue extends TenantData {
  updateTenant: (patch: Partial<Pick<TenantData, 'tenantName'>>) => void;
}

const STORAGE_KEY = 'tenant_settings';

const DEFAULT_TENANT: TenantData = {
  tenantId: 'healingbreeze',
  tenantName: 'Healing Breeze',
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantData>(() => {
    if (typeof window === 'undefined') return DEFAULT_TENANT;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_TENANT, ...JSON.parse(stored) } : DEFAULT_TENANT;
    } catch {
      return DEFAULT_TENANT;
    }
  });

  const updateTenant = (patch: Partial<Pick<TenantData, 'tenantName'>>) => {
    setTenant(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tenantName: next.tenantName,
      }));
      return next;
    });
  };

  return (
    <TenantContext.Provider value={{
      ...tenant,
      updateTenant,
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}

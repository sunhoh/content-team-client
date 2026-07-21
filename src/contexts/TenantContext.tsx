'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TenantData {
  tenantId: string;
  tenantName: string;
}

interface TenantContextValue extends TenantData {
  updateTenant: (patch: Partial<Pick<TenantData, 'tenantName'>>) => void;
}

const DEFAULT_TENANT: TenantData = {
  tenantId: 'healingbreeze',
  tenantName: 'Healing Breeze',
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantData>(() => {
    if (typeof window === 'undefined') return DEFAULT_TENANT;
    const stored = localStorage.getItem('tenant');
    return stored ? { ...DEFAULT_TENANT, tenantName: stored } : DEFAULT_TENANT;
  });

  const updateTenant = (patch: Partial<Pick<TenantData, 'tenantName'>>) => {
    setTenant(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem('tenant', next.tenantName);
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

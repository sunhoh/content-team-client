'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface TenantData {
  tenantId: string;
  companyName: string;
}

interface TenantContextValue extends TenantData {
  updateTenant: (patch: Partial<TenantData>) => void;
}

const DEFAULT_TENANT: TenantData = {
  tenantId: '',
  companyName: 'healingbreeze',
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantData>(DEFAULT_TENANT);

  useEffect(() => {
    const stored = localStorage.getItem('tenantId');
    if (stored) setTenant(prev => ({ ...prev, tenantId: stored }));
  }, []);

  const updateTenant = (patch: Partial<TenantData>) => {
    setTenant(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem('tenantId', next.tenantId);
      return next;
    });
  };

  return (
    <TenantContext.Provider
      value={{
        ...tenant,
        updateTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}

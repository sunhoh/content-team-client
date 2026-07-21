'use client';

import React from 'react';

import RootLayout from '@/components/layouts/RootLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { TenantProvider } from '@/contexts/TenantContext';

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <TenantProvider>
      <AuthProvider>
        <TaskProvider>
          <RootLayout>{children}</RootLayout>
        </TaskProvider>
      </AuthProvider>
    </TenantProvider>
  );
}

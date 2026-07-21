'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Path } from '@/constants/path.constants';
import { N } from '@/constants/theme.constants';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) return;
    router.replace(isAuthenticated ? Path.DASHBOARD : Path.AHTH);
  }, [isAuthenticated, isAuthLoading, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: N.base,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          boxShadow: `6px 6px 12px ${N.dark}, -6px -6px 12px ${N.light}`,
          border: `3px solid transparent`,
          borderTopColor: N.accent,
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

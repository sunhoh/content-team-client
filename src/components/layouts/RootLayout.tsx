'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Path } from '@/constants/path.constants';
import { useAuth } from '@/contexts/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthLoading && pathname !== Path.AHTH && !isAuthenticated) {
      router.push(Path.AHTH);
    }
  }, [isAuthLoading, isAuthenticated, router, pathname]);

  return <>{children}</>;
}

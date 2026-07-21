'use client';

import { useEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

const BP = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const;

const DEFAULT = {
  isSm: false,
  isMd: false,
  isLg: false,
  isXl: false,
  is2xl: false,
};

export function useBreakpoint() {
  const { width } = useWindowSize();
  const [bp, setBp] = useState(DEFAULT);

  useEffect(() => {
    setBp({
      isSm: width >= BP.sm,
      isMd: width >= BP.md,
      isLg: width >= BP.lg,
      isXl: width >= BP.xl,
      is2xl: width >= BP['2xl'],
    });
  }, [width]);

  return bp;
}

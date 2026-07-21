import type { Metadata } from 'next';

import './globals.css';

import { Geist } from 'next/font/google';

import { cn } from '@/lib/utils';

import { Providers } from './providers';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Content Team · Dashboard',
  description: 'AI 에이전트 기반 콘텐츠 마케팅 팀 대시보드',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      suppressHydrationWarning
      className={cn('font-sans', geist.variable)}
    >
      <Providers>
        <head>
          {/* <link rel='stylesheet' href='https://use.typekit.net/mds2ata.css' /> */}
        </head>
        <body>{children}</body>
      </Providers>
    </html>
  );
}

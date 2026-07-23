'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { StatusBar } from '@/components/layouts/ui/StatusBar';
import { TopBar } from '@/components/layouts/ui/TopBar';
import ReportView from '@/components/works/ReportView';
import TasksView from '@/components/works/TasksView';
import { QueryParams } from '@/constants/path.constants';

function WorkContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get(QueryParams.ID);
  return id ? <ReportView /> : <TasksView />;
}

export default function WorkPage() {
  return (
    <>
      <TopBar />
      <Suspense>
        <WorkContent />
      </Suspense>
      <StatusBar />
    </>
  );
}

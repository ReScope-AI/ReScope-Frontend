import { Suspense } from 'react';

import FormCardSkeleton from '@/components/form-card-skeleton';
import KanbanViewPage from '@/features/kanban/components/kanban-view-page';

export const metadata = {
  title: 'ReScope | Retrospective View',
  description: 'Retrospective View',
  icons: {
    icon: '/assets/logo.png',
    shortcut: '/assets/logo.png',
    apple: '/assets/logo.png'
  }
};

export default async function Page({
  params
}: {
  params: Promise<{ retroId: string }>;
}) {
  const { retroId } = await params;

  return (
    <div className='flex-1 space-y-4'>
      <Suspense fallback={<FormCardSkeleton />}>
        <KanbanViewPage retroId={retroId} />
      </Suspense>
    </div>
  );
}

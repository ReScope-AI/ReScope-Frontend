import FormCardSkeleton from '@/components/form-card-skeleton';
import KanbanViewPage from '@/features/kanban/components/kanban-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Retrospective View'
};

export default async function Page({
  params
}: {
  params: { retroId: string };
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

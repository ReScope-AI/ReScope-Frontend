import FormCardSkeleton from '@/components/form-card-skeleton';
import KanbanViewPage from '@/features/kanban/components/kanban-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Retrospective View'
};

export default async function Page() {
  return (
    <div className='flex-1 space-y-4'>
      <Suspense fallback={<FormCardSkeleton />}>
        <KanbanViewPage />
      </Suspense>
    </div>
  );
}

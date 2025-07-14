import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import Retrospective from '@/features/retrospectives/retrospective';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Retrospective View'
};

type PageProps = { params: Promise<{ retroId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <Retrospective />
        </Suspense>
      </div>
    </PageContainer>
  );
}

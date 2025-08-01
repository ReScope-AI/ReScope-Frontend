import { SearchParams } from 'nuqs/server';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import Retrospective from '@/features/retrospectives/retrospective-page';
import { searchParamsCache } from '@/lib/searchparams';

export const metadata = {
  title: 'Re-Scope: Retrospective',
  description: 'Manage retrospective'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Retrospective' description='Manage retrospective' />
        </div>
        <Separator />
        <Retrospective />
      </div>
    </PageContainer>
  );
}

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { KanbanBoard } from './kanban-board';
import NewTaskDialog from './new-task-dialog';

export default function KanbanViewPage() {
  return (
    <PageContainer scrollable>
      <div className='flex h-full flex-col'>
        {/* Sticky header with responsive design */}
        <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur'>
          <div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between'>
            <Heading
              title={`Retrospective`}
              description='Manage tasks by dnd'
            />
            <div className='flex-shrink-0'>
              <NewTaskDialog />
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-hidden'>
          <KanbanBoard />
        </div>
      </div>
    </PageContainer>
  );
}

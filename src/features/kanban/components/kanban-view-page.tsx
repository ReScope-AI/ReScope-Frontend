import { KanbanBoard } from './kanban-board';
import NewTaskDialog from './new-task-dialog';

export default function KanbanViewPage() {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex-shrink-0'>
        <NewTaskDialog />
      </div>

      <div className='flex-1 overflow-hidden'>
        <KanbanBoard />
      </div>
    </div>
  );
}

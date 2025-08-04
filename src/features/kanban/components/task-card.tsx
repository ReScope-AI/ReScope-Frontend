import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconEdit,
  IconGripVertical,
  IconMinus,
  IconPlus,
  IconTrash
} from '@tabler/icons-react';
import { cva } from 'class-variance-authority';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRetroSocket } from '@/hooks/use-retro-socket';
import { emitDeletePlan } from '@/lib/retro-socket';

import { getTaskColorClasses } from '../utils';
import { useTaskStore, type Task } from '../utils/store';

import EditTaskDialog from './edit-task-dialog';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  disableDragExternal?: boolean;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({
  task,
  isOverlay,
  disableDragExternal = false
}: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task'
    },
    disabled: disableDragExternal
  });

  const updateTaskVotes = useTaskStore((state) => state.updateTaskVotes);
  const columns = useTaskStore((state) => state.columns);
  const { retroId } = useRetroSocket();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditTask = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleDeleteTask = () => {
    if (!retroId) return;
    emitDeletePlan({
      roomId: retroId,
      id: String(task._id)
    });
  };

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  // Find the column for this task
  const taskColumn = columns.find((col) => col.id === task.status);

  // Get color classes based on task status
  const colorClasses = getTaskColorClasses(taskColumn?.title || '');

  const variants = cva(
    `mb-2 ${colorClasses.bg} ${colorClasses.border} border-2 py-2`,
    {
      variants: {
        dragging: {
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary'
        }
      }
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardHeader className='space-between border-secondary relative flex flex-row border-b-2 px-3 py-3'>
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className='text-secondary-foreground/50 -ml-2 h-auto cursor-grab p-1'
        >
          <span className='sr-only'>Move task</span>
          <IconGripVertical />
        </Button>
        <div className='ml-auto flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            className='h-6 w-6 p-0 text-gray-500 hover:text-blue-600'
            onClick={handleEditTask}
          >
            <IconEdit className='h-3 w-3' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-6 w-6 p-0 text-gray-500 hover:text-red-600'
            onClick={handleDeleteTask}
          >
            <IconTrash className='h-3 w-3' />
          </Button>
          <Badge
            variant={'outline'}
            className={`font-semibold ${colorClasses.badge}`}
          >
            {taskColumn?.title || task.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='px-3 pt-3 pb-3 text-left'>
        <div className='mb-3 whitespace-pre-wrap'>{task.title}</div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0'
              onClick={() => updateTaskVotes(task._id, false)}
            >
              <IconMinus className='h-3 w-3' />
            </Button>
            <Badge variant='secondary' className='min-w-[20px] text-center'>
              {task.votes || 0}
            </Badge>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0'
              onClick={() => updateTaskVotes(task._id, true)}
            >
              <IconPlus className='h-3 w-3' />
            </Button>
          </div>
        </div>
      </CardContent>
      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        task={task}
      />
    </Card>
  );
}

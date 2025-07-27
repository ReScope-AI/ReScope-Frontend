import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Task, useTaskStore } from '../utils/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { IconGripVertical, IconPlus, IconMinus } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

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

const getTaskColorClasses = (status: string) => {
  switch (status) {
    case 'DROP':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        badge: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
      };
    case 'ADD':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        badge:
          'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
      };
    case 'KEEP':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        badge:
          'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
      };
    case 'IMPROVE':
      return {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-800 dark:text-orange-200',
        badge:
          'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        border: 'border-gray-200 dark:border-gray-800',
        text: 'text-gray-800 dark:text-gray-200',
        badge: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      };
  }
};

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

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const colorClasses = getTaskColorClasses(task.status);

  const variants = cva(
    `mb-2 ${colorClasses.bg} ${colorClasses.border} border-2`,
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
        <Badge
          variant={'outline'}
          className={`ml-auto font-semibold ${colorClasses.badge}`}
        >
          {task.status}
        </Badge>
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
    </Card>
  );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconGripVertical,
  IconPlus,
  IconMinus,
  IconRotate360,
  IconSettings
} from '@tabler/icons-react';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { Task, useTaskStore } from '../utils/store';
import { ColumnActions } from './column-action';
import { TaskCard } from './task-card';
import { cn } from '@/lib/utils';

export interface Column {
  id: UniqueIdentifier;
  title: string;
  question?: string;
  color?: string;
  icon?: string;
  disableDragExternal?: boolean;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
  allowDragExternal?: boolean;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
  disableDragExternal?: boolean;
}

const getColumnIcon = (icon: string) => {
  switch (icon) {
    case 'minus':
      return <IconMinus className='h-4 w-4' />;
    case 'plus':
      return <IconPlus className='h-4 w-4' />;
    case 'loop':
      return <IconRotate360 className='h-4 w-4' />;
    case 'gear':
      return <IconSettings className='h-4 w-4' />;
    default:
      return <IconPlus className='h-4 w-4' />;
  }
};

const getColumnColorClasses = (color: string) => {
  switch (color) {
    case 'red':
      return {
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
        icon: 'text-red-600 dark:text-red-400'
      };
    case 'green':
      return {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
        icon: 'text-green-600 dark:text-green-400'
      };
    case 'orange':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-300',
        icon: 'text-orange-600 dark:text-orange-400'
      };
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-950/20',
        border: 'border-gray-200 dark:border-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        icon: 'text-gray-600 dark:text-gray-400'
      };
  }
};

export function BoardColumn({
  column,
  tasks,
  isOverlay,
  disableDragExternal = false
}: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    },
    disabled: disableDragExternal
  });

  const setOpenDialog = useTaskStore((state) => state.setOpenDialog);

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const colorClasses = getColumnColorClasses(column.color || 'gray');

  const variants = cva(
    `h-[75vh] max-h-[75vh] w-[300px] sm:w-[350px] flex flex-col shrink-0 snap-start ${colorClasses.bg} ${colorClasses.border} border-2`,
    {
      variants: {
        dragging: {
          default: 'border-transparent',
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
      <CardHeader className='space-between flex flex-col items-start border-b-2 p-4 text-left'>
        <div className='flex w-full items-center justify-between'>
          <Button
            variant={'ghost'}
            {...attributes}
            {...listeners}
            className={`${colorClasses.icon} relative -ml-2 h-auto cursor-grab p-1`}
          >
            <span className='sr-only'>{`Move column: ${column.title}`}</span>
            <IconGripVertical />
          </Button>
          <div className='flex items-center gap-2'>
            <div className={`${colorClasses.icon}`}>
              {getColumnIcon(column.icon || 'default')}
            </div>
          </div>
          <ColumnActions id={column.id} title={column.title} />
        </div>
        {column.question && (
          <p className={`text-sm ${colorClasses.text} mt-2 opacity-80`}>
            {column.question}
          </p>
        )}
      </CardHeader>
      <CardContent className='flex grow flex-col gap-4 overflow-x-hidden p-2'>
        <ScrollArea className='h-full'>
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                disableDragExternal={disableDragExternal}
              />
            ))}
            <Button
              variant='outline'
              className={`w-full cursor-pointer ${colorClasses.border} ${colorClasses.text} hover:${colorClasses.bg}`}
              size='icon'
              onClick={() => setOpenDialog(true)}
            >
              <IconPlus className={colorClasses.icon} />
            </Button>
          </SortableContext>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function BoardContainer({
  children,
  scrollClassName
}: {
  children: React.ReactNode;
  scrollClassName?: string;
}) {
  const dndContext = useDndContext();

  const variations = cva('flex max-w-screen-lg', {
    variants: {
      dragging: {
        default: '',
        active: 'snap-none'
      }
    }
  });

  return (
    <ScrollArea
      className={cn('h-full flex-row items-start gap-4', scrollClassName)}
    >
      <div
        className={variations({
          dragging: dndContext.active ? 'active' : 'default'
        })}
      >
        <div className='flex min-w-max flex-row items-start gap-4 p-4'>
          {children}
        </div>
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}

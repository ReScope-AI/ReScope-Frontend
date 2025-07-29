import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { Task, useTaskStore } from '../utils/store';
import { ColumnActions } from './column-action';
import { TaskCard } from './task-card';
import { cn } from '@/lib/utils';
import { IconGripVertical, IconPlus } from '@tabler/icons-react';
import { getColumnColorClasses, getColumnIcon } from '../utils';

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

export function BoardColumn({
  column,
  tasks,
  isOverlay,
  disableDragExternal = false
}: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task._id);
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
    `h-[80vh] max-h-[80vh] w-[300px] sm:w-[350px] flex flex-col shrink-0 snap-start ${colorClasses.bg} ${colorClasses.border} border-2 gap-2`,
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
                key={task._id}
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

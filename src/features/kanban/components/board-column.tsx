import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconPlus } from '@tabler/icons-react';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import {
  getCategoryProperties,
  getColumnColorClasses,
  getColumnIcon
} from '../utils';
import { Task, useTaskStore } from '../utils/store';

import { ColumnActions } from './column-action';
import { TaskCard } from './task-card';

export interface Column {
  id: UniqueIdentifier;
  title: string;
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

  const isGenerating = useTaskStore((state) => state.isGenerating);
  const setOpenDialog = useTaskStore((state) => state.setOpenDialog);

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const categoryProperties = getCategoryProperties(column.title);
  const colorClasses = getColumnColorClasses(categoryProperties.color);

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
            <span className='sr-only'>{`Move column: ${categoryProperties.title}`}</span>
            <IconGripVertical />
          </Button>
          <div className='flex items-center gap-2'>
            <div className={`${colorClasses.icon}`}>
              {getColumnIcon(categoryProperties.icon)}
            </div>
          </div>
          <ColumnActions id={column.id} title={categoryProperties.title} />
        </div>
        {categoryProperties.question && (
          <p className={`text-sm ${colorClasses.text} mt-2 opacity-80`}>
            {categoryProperties.question}
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
            <Card
              className={`${colorClasses.bg} animate-pulse border-2`}
              hidden={!isGenerating}
            >
              <CardContent className='p-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <Badge
                    variant='secondary'
                    className={`${categoryProperties.color} bg-opacity-20 text-xs`}
                  >
                    <Loader2 className='mr-1 h-3 w-3 animate-spin' />
                    GENERATING...
                  </Badge>
                </div>
                <div className='space-y-2'>
                  <div className='h-3 animate-pulse rounded bg-gray-300'></div>
                  <div className='h-3 w-4/5 animate-pulse rounded bg-gray-300'></div>
                  <div className='h-3 w-3/5 animate-pulse rounded bg-gray-300'></div>
                </div>
              </CardContent>
            </Card>
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

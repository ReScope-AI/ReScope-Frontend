import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { IQuestion } from '@/types';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconGripVertical,
  IconMinus,
  IconPlus,
  IconRotate360,
  IconSettings,
  IconChartHistogram
} from '@tabler/icons-react';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { useTaskStore } from '../utils/store';
import { ColumnActions } from './column-action';
import { TaskCard } from './task-card';

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

interface PollsColumnProps {
  column: Column;
  questions: IQuestion[];
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
    case 'chart':
      return <IconChartHistogram className='h-4 w-4' />;
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

export function PollsColumn({
  column,
  questions,
  isOverlay,
  disableDragExternal = false
}: PollsColumnProps) {
  const questionsIds = useMemo(() => {
    return questions.map((question) => question._id);
  }, [questions]);

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
      <CardHeader className='flex flex-col items-start space-y-2 border-b-2 p-4 text-left'>
        <div className='flex w-full items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Button
              variant={'ghost'}
              {...attributes}
              {...listeners}
              className={`${colorClasses.icon} relative h-8 w-8 cursor-grab p-0 hover:bg-white/50 dark:hover:bg-gray-800/50`}
            >
              <span className='sr-only'>{`Move column: ${column.title}`}</span>
              <IconGripVertical className='h-4 w-4' />
            </Button>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/50 dark:bg-gray-800/50 ${colorClasses.icon}`}
            >
              {getColumnIcon(column.icon || 'default')}
            </div>
          </div>
          <ColumnActions id={column.id} title={column.question || 'Polls'} />
        </div>

        <div className='w-full space-y-2'>
          <h3 className={`text-xl font-bold ${colorClasses.text}`}>
            {column.title}
          </h3>
          {column.question && (
            <p
              className={`text-sm leading-relaxed ${colorClasses.text} opacity-90`}
            >
              {column.question}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className='flex grow flex-col gap-4 overflow-x-hidden p-2'>
        <ScrollArea className='h-full'>
          <SortableContext items={questionsIds}>
            {questions.map((question) => (
              <TaskCard
                key={question._id}
                task={{
                  _id: question._id,
                  title: question.text,
                  status: 'POLL',
                  votes: 0
                }}
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

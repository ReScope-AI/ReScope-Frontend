'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconEdit,
  IconGripVertical,
  IconTrash,
  IconDots
} from '@tabler/icons-react';
import { cva } from 'class-variance-authority';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRetroSocket } from '@/hooks/use-retro-socket';
import { emitDeletePlan } from '@/lib/retro-socket';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { useUserStore } from '@/stores/userStore';

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

  const retroSession = useRetroSessionStore((state) => state.retroSession);
  const user = useUserStore((state) => state.user);
  const isOwner = retroSession?.created_by === user?._id;
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

  const taskColumn = columns.find((col) => col.id === task.status);
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
      <CardHeader
        className={`${isOwner ? 'justify-between' : 'justify-start'} border-secondary relative flex flex-row border-b-2 px-3 py-3`}
      >
        {isOwner && (
          <Button
            variant={'ghost'}
            {...attributes}
            {...listeners}
            className='text-secondary-foreground/50 -ml-2 h-auto cursor-grab p-1'
          >
            <span className='sr-only'>Move task</span>
            <IconGripVertical />
          </Button>
        )}
        <div className='ml-auto flex items-center gap-1'>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-6 w-6 p-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                >
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-background border-input dark:bg-background dark:border-input'>
                <DropdownMenuItem
                  onClick={handleEditTask}
                  className='text-foreground hover:bg-muted dark:hover:bg-muted cursor-pointer'
                >
                  <IconEdit className='mr-2 h-4 w-4' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteTask}
                  className='text-foreground hover:bg-muted dark:hover:bg-muted cursor-pointer'
                >
                  <IconTrash className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
      </CardContent>
      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        task={task}
      />
    </Card>
  );
}

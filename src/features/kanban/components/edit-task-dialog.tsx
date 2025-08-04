'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRetroSocket } from '@/hooks/use-retro-socket';
import { emitChangePositionPlan, emitEditPlan } from '@/lib/retro-socket';

import { useTaskStore, type ColumnId, type Task } from '../utils/store';

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function EditTaskDialog({
  isOpen,
  onClose,
  task
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<ColumnId>(task.status);

  const columns = useTaskStore((state) => state.columns);
  const { retroId } = useRetroSocket();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!retroId) return;

    // Emit edit plan event for text changes
    if (title !== task.title) {
      emitEditPlan({
        roomId: retroId,
        id: String(task._id),
        text: title
      });
    }

    // Emit change position plan event for status/category changes
    if (status !== task.status) {
      emitChangePositionPlan({
        roomId: retroId,
        changePlan: String(task._id),
        category_id: String(status)
      });
    }

    onClose();
  };

  const handleCancel = () => {
    // Reset form to original values
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form
          id='edit-task-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='title' className='text-right'>
              Title
            </Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Task title...'
              className='col-span-3'
              required
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='status' className='text-right'>
              Category
            </Label>
            <Select
              value={String(status)}
              onValueChange={(value) => setStatus(value as ColumnId)}
              required
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column.id} value={String(column.id)}>
                    {column.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='description' className='text-right'>
              Description
            </Label>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Description...'
              className='col-span-3'
            />
          </div>
        </form>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button type='submit' size='sm' form='edit-task-form'>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

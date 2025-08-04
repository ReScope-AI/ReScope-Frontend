'use client';

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

import { useTaskStore, type ColumnId } from '../utils/store';

export default function NewTaskDialog() {
  const addTask = useTaskStore((state) => state.addTask);
  const openDialog = useTaskStore((state) => state.openDialog);
  const setOpenDialog = useTaskStore((state) => state.setOpenDialog);
  const columns = useTaskStore((state) => state.columns);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const { title, description, status } = Object.fromEntries(formData);

    if (typeof title !== 'string' || typeof status !== 'string') return;
    addTask(title, status as ColumnId, description as string);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            What do you want to get done today?
          </DialogDescription>
        </DialogHeader>
        <form
          id='todo-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='title' className='text-right'>
              Title
            </Label>
            <Input
              id='title'
              name='title'
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
              name='status'
              defaultValue={String(columns[0]?.id)}
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
              name='description'
              placeholder='Description...'
              className='col-span-3'
            />
          </div>
        </form>
        <DialogFooter>
          <Button type='submit' size='sm' form='todo-form'>
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

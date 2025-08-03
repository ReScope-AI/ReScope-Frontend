'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const actionItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
});

type ActionItemFormData = z.infer<typeof actionItemSchema>;

const DrawerActionItemContent = () => {
  const [isAddingActionItem, setIsAddingActionItem] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ActionItemFormData>({
    resolver: zodResolver(actionItemSchema)
  });

  const handleAddClick = () => {
    setIsAddingActionItem(true);
  };

  const handleCancelClick = () => {
    reset();
    setIsAddingActionItem(false);
  };

  const onSubmit = (data: ActionItemFormData) => {
    console.log('Form submitted:', data);
    reset();
    setIsAddingActionItem(false);
  };

  return (
    <div className='flex-1 overflow-y-auto p-4'>
      {isAddingActionItem ? (
        <form onSubmit={handleSubmit(onSubmit)} className='rounded-xl'>
          <div className='mb-4'>
            <label htmlFor='title' className='block text-sm font-medium'>
              Title
            </label>
            <Input
              id='title'
              {...register('title')}
              className='mt-1 block w-full rounded-lg'
            />
            {errors.title && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.title.message}
              </p>
            )}
          </div>

          <div className='mb-6'>
            <label htmlFor='description' className='block text-sm font-medium'>
              Description
            </label>
            <Textarea
              id='description'
              {...register('description')}
              className='mt-1 block w-full rounded-lg'
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              type='button'
              onClick={handleCancelClick}
              className='bg-transparent'
            >
              Cancel
            </Button>
            <Button type='submit'>
              <Plus className='mr-2 h-5 w-5' />
              Add Action Item
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={handleAddClick} className='w-full rounded-lg'>
          <Plus className='mr-2 h-5 w-5' />
          Add Action Item
        </Button>
      )}
    </div>
  );
};

export default DrawerActionItemContent;

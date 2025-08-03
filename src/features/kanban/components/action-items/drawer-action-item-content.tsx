'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateActionItem,
  useDeleteActionItem
} from '@/hooks/use-action-item';
import { emitAddActionItem, emitDeleteActionItem } from '@/lib/retro-socket';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { IActionItem } from '@/types/IActionItem';

import ActionItemCard from './action-item-card';

const actionItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
});

type ActionItemFormData = z.infer<typeof actionItemSchema>;

type DrawerActionItemContentProps = {
  retroId: string;
};

const DrawerActionItemContent = ({ retroId }: DrawerActionItemContentProps) => {
  const [isAddingActionItem, setIsAddingActionItem] = useState(false);

  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);

  const actionItems = useRetroSessionStore(
    (state) => state.retroSession?.actionItems
  );

  const { mutate: createActionItem, isPending } = useCreateActionItem(
    (data: IActionItem) => {
      emitAddActionItem({
        _id: data._id,
        session_id: retroId,
        title: data.title,
        description: data.description,
        status: 'pending',
        roomId: retroId
      });
      setIsAddingActionItem(false);
      reset();
      setIsAddingActionItem(false);
    },
    (error) => {
      toast.error('Action item created failed', {
        description: error.message
      });
    }
  );

  const { mutate: deleteActionItem, isPending: isDeletingActionItem } =
    useDeleteActionItem(
      (data: IActionItem) => {
        emitDeleteActionItem({
          roomId: retroId,
          _id: data._id
        });
        setIsOpenEditDialog(false);
      },
      (error) => {
        toast.error('Action item deleted failed', {
          description: error.message
        });
      }
    );

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

  const onSubmit = async (data: ActionItemFormData) => {
    createActionItem({
      title: data.title,
      description: data.description,
      status: 'pending',
      session_id: retroId
    });
  };

  return (
    <div className='overflow-y-auto p-4'>
      {/* Hiển thị danh sách action items */}
      {actionItems && actionItems.length > 0 && (
        <div className='space-y-3'>
          {actionItems.map((actionItem: IActionItem) => (
            <ActionItemCard
              key={actionItem._id}
              actionItem={actionItem}
              handleDeleteActionItem={deleteActionItem}
              isDeletingActionItem={isDeletingActionItem}
              setIsOpenEditDialog={setIsOpenEditDialog}
              isOpenEditDialog={isOpenEditDialog}
            />
          ))}
        </div>
      )}

      {/* Form thêm action item mới */}
      {isAddingActionItem ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label htmlFor='title' className='block text-sm font-medium'>
              Title
            </label>
            <Input
              id='title'
              {...register('title')}
              className='mt-1 block w-full rounded-lg'
              placeholder='Enter action item title...'
              disabled={isPending}
            />
            {errors.title && (
              <p className='mt-1 text-sm text-red-400'>
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
              placeholder='Enter description (optional)...'
              disabled={isPending}
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-400'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              type='button'
              onClick={handleCancelClick}
              className='cursor-pointer'
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='cursor-pointer'
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
              ) : (
                <Plus className='mr-2 h-5 w-5' />
              )}
              Add Action Item
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={handleAddClick}
          className='w-full cursor-pointer rounded-lg'
        >
          <Plus className='mr-2 h-5 w-5' />
          Add Action Item
        </Button>
      )}
    </div>
  );
};

export default DrawerActionItemContent;

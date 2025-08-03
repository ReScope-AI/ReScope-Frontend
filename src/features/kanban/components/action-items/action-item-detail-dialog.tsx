'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleSlash, Loader2, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEditActionItem } from '@/hooks/use-action-item';
import { emitEditActionItem } from '@/lib/retro-socket';
import { useUserStore } from '@/stores/userStore';
import { IActionItem } from '@/types/IActionItem';

// 1. Define the schema for your form fields
const actionItemFormSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty.'),
  description: z.string().optional(),
  status: z.string().min(1, 'Status is required.'),
  priority: z.string().min(1, 'Priority is required.')
});

interface ActionItemDetailDialogProps {
  actionItem: IActionItem;
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

const ActionItemDetailDialog = ({
  actionItem,
  isOpen,
  onClose,
  roomId
}: ActionItemDetailDialogProps) => {
  const { user } = useUserStore();

  // 2. Define your form with zodResolver
  const form = useForm<z.infer<typeof actionItemFormSchema>>({
    resolver: zodResolver(actionItemFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: '',
      priority: ''
    }
  });

  // Update form values when actionItem changes
  useEffect(() => {
    if (actionItem) {
      form.reset({
        title: actionItem.title || '',
        description: actionItem.description || '',
        status: actionItem.status || 'pending',
        priority: actionItem.priority || 'medium'
      });
    }
  }, [actionItem, form]);

  const { mutate: editActionItem, isPending } = useEditActionItem(
    () => {
      emitEditActionItem({
        _id: actionItem._id,
        title: form.getValues('title'),
        description: form.getValues('description'),
        status: form.getValues('status'),
        priority: form.getValues('priority'),
        roomId: roomId
      });
      onClose();
    },
    (error) => {
      toast.error(error.message);
    }
  );

  // 3. Handle form submission
  const handleUpdateActionItem = (
    values: z.infer<typeof actionItemFormSchema>
  ) => {
    editActionItem({
      _id: actionItem._id,
      ...values
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] w-[90vw] max-w-[1400px] min-w-[800px] overflow-hidden rounded-lg'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <DialogTitle className='text-xl font-semibold'>
            Action Item Details
          </DialogTitle>
        </DialogHeader>

        {/* 4. Wrap the main content with the <Form> component */}
        <Form {...form}>
          <form className='flex h-full w-full gap-6 overflow-hidden'>
            <div className='flex-1 space-y-6 overflow-y-auto'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={user?.avatar} alt='User' />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-medium'>{user?.email}</p>
                  <p className='text-muted-foreground text-xs'>
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <h3 className='mb-2 text-sm font-semibold'>Title</h3>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Action item title'
                          disabled={isPending}
                          className='border-none px-0 text-2xl shadow-none focus-visible:ring-0'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Input */}
              <div>
                <h3 className='mb-2 text-sm font-semibold'>Description</h3>
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder='No description provided'
                          disabled={isPending}
                          className='text-muted-foreground resize-none border-none p-0 text-sm shadow-none focus-visible:ring-0'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Section - Task Details */}
            <div className='w-2/4 space-y-4'>
              <Card>
                <CardContent className='space-y-4 p-4'>
                  {/* Assignee */}
                  <div>
                    <p className='text-muted-foreground mb-2 text-xs font-semibold'>
                      ASSIGNEE
                    </p>
                    <div className='flex items-center gap-2'>
                      <CircleSlash className='text-muted-foreground h-4 w-4' />
                      <span className='text-sm'>Not Assigned</span>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <p className='text-muted-foreground mb-2 text-xs font-semibold'>
                      PRIORITY
                    </p>
                    <FormField
                      control={form.control}
                      name='priority'
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className='h-8 w-full'
                                disabled={isPending}
                              >
                                <SelectValue placeholder='Select priority' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='low'>Low</SelectItem>
                              <SelectItem value='medium'>Medium</SelectItem>
                              <SelectItem value='high'>High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <p className='text-muted-foreground mb-2 text-xs font-semibold'>
                      STATUS
                    </p>
                    <FormField
                      control={form.control}
                      name='status'
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className='h-8 w-full'
                                disabled={isPending}
                              >
                                <SelectValue placeholder='Select status' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='pending'>Pending</SelectItem>
                              <SelectItem value='in_progress'>
                                In Progress
                              </SelectItem>
                              <SelectItem value='completed'>
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>

        <div className='flex justify-end'>
          <Button
            size='sm'
            type='button'
            onClick={form.handleSubmit(handleUpdateActionItem)}
            disabled={!form.formState.isValid || isPending}
          >
            {isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Save className='mr-2 h-4 w-4' />
            )}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionItemDetailDialog;

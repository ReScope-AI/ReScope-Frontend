'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { showNotification } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCreateRetroSession } from '@/hooks/use-retro-session-api';

import { sprintFormSchema, type SprintFormData } from '../schemas/validation';

import SprintNameSelector from './sprint-name-selector';
import TeamNameSelector from './team-name-selector';

type DialogSelectBoardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogSelectBoard = ({ open, onOpenChange }: DialogSelectBoardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<SprintFormData>({
    resolver: zodResolver(sprintFormSchema),
    defaultValues: {
      sprintId: '',
      retroName: '',
      teamId: '',
      template: 'daki'
    }
  });

  const createRetroSessionMutation = useCreateRetroSession();

  const handleSubmit = async (data: SprintFormData) => {
    if (!data.teamId) {
      showNotification('error', 'Please select a team');
      return;
    }

    setIsSubmitting(true);
    try {
      const retroResult = await createRetroSessionMutation.mutateAsync({
        name: data.retroName,
        team_id: data.teamId,
        sprint_id: data.sprintId,
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      showNotification(
        'success',
        'Sprint and Retro Session created successfully!'
      );

      router.push(`/dashboard/retrospective/${retroResult.data._id}`);
    } catch (error) {
      // Not need to show notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamChange = (teamId: string) => {
    form.setValue('teamId', teamId);
  };

  const handleSprintChange = (sprintId: string) => {
    form.setValue('sprintId', sprintId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className='min-w-3xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            Create Sprint & Retro
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='max-h-[70vh] w-full overflow-y-auto'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='retroName'>Retro Name</Label>
                <Input
                  id='retroName'
                  placeholder='Retro Name'
                  className='w-full'
                  {...form.register('retroName')}
                />
                {form.formState.errors.retroName && (
                  <span className='text-sm text-red-500'>
                    {form.formState.errors.retroName.message}
                  </span>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Sprint Name</Label>
                <SprintNameSelector
                  value={form.watch('sprintId')}
                  onValueChange={handleSprintChange}
                />
                {form.formState.errors.teamId && (
                  <span className='text-sm text-red-500'>
                    {form.formState.errors.teamId.message}
                  </span>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Team Name</Label>
                <TeamNameSelector
                  value={form.watch('teamId')}
                  onValueChange={handleTeamChange}
                />
                {form.formState.errors.teamId && (
                  <span className='text-sm text-red-500'>
                    {form.formState.errors.teamId.message}
                  </span>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <Label htmlFor='template'>Select Templates</Label>
                <Select
                  defaultValue='daki'
                  onValueChange={(value) => form.setValue('template', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a template' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Common Templates</SelectLabel>
                      <SelectItem value='start-stop-continue'>
                        Start-Stop-Continue
                      </SelectItem>
                      <SelectItem value='glad-sad-mad'>
                        Glad, Sad, Mad
                      </SelectItem>
                      <SelectItem value='daki'>
                        DAKI - Drop, Add, Keep, Improve
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {form.formState.errors.template && (
                  <span className='text-sm text-red-500'>
                    {form.formState.errors.template.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className='mt-4 flex justify-end'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 hover:bg-blue-700'
                disabled={
                  isSubmitting ||
                  !form.watch('teamId') ||
                  !form.watch('sprintId') ||
                  !form.watch('retroName')
                }
              >
                {isSubmitting ? (
                  <>
                    Creating...
                    <ChevronRight className='ml-2 h-4 w-4 animate-pulse' />
                  </>
                ) : (
                  <>
                    Create Retro Session
                    <ChevronRight className='ml-2 h-4 w-4' />
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSelectBoard;

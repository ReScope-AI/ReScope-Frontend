'use client';

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
import { useCreateSprint } from '@/hooks/use-sprint-api';
import { useUserStore } from '@/stores/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { sprintFormSchema, type SprintFormData } from '../schemas/validation';
import TeamNameSelector from './team-name-selector';

type DialogSelectBoardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogSelectBoard = ({ open, onOpenChange }: DialogSelectBoardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();
  const form = useForm<SprintFormData>({
    resolver: zodResolver(sprintFormSchema),
    defaultValues: {
      sprintName: '',
      retroName: '',
      teamId: '',
      template: 'daki'
    }
  });

  const createSprintMutation = useCreateSprint();
  const createRetroSessionMutation = useCreateRetroSession();

  const handleSubmit = async (data: SprintFormData) => {
    if (!data.teamId) {
      toast.error('Please select a team');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create Sprint
      const sprintData = {
        name: data.sprintName,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: user?._id || ''
      };

      const sprintResult = await createSprintMutation.mutateAsync(sprintData);

      if (!sprintResult?.data?._id) {
        throw new Error('Failed to create sprint - no ID returned');
      }

      const sprintId = sprintResult.data._id;

      // Step 2: Create Retro Session with Sprint ID
      const retroSessionData = {
        name: data.retroName,
        team_id: data.teamId,
        sprint_id: sprintId,
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      const retroResult =
        await createRetroSessionMutation.mutateAsync(retroSessionData);

      if (retroResult?.data) {
        toast.success('Sprint and Retro Session created successfully!');

        router.push(`/dashboard/retrospective/${retroResult.data._id}`);
      } else {
        throw new Error('Failed to create retro session - no data returned');
      }
    } catch (error) {
      toast.error(
        'Failed to create sprint or retro session. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamChange = (teamId: string) => {
    form.setValue('teamId', teamId);
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
                <Label htmlFor='sprintName'>Sprint Name</Label>
                <Input
                  id='sprintName'
                  placeholder='Sprint Name'
                  className='w-full'
                  {...form.register('sprintName')}
                />
                {form.formState.errors.sprintName && (
                  <span className='text-sm text-red-500'>
                    {form.formState.errors.sprintName.message}
                  </span>
                )}
              </div>

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
                  !form.watch('sprintName') ||
                  !form.watch('retroName') ||
                  createSprintMutation.isPending ||
                  createRetroSessionMutation.isPending
                }
              >
                {isSubmitting ? (
                  <>
                    Creating...
                    <ChevronRight className='ml-2 h-4 w-4 animate-pulse' />
                  </>
                ) : (
                  <>
                    Create Sprint & Retro
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

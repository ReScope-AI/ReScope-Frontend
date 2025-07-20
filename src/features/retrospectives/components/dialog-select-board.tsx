'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boardTypes } from '../data';
import { sprintFormSchema, type SprintFormData } from '../schemas/validation';
import TeamNameSelector from './team-name-selector';

type DialogSelectBoardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBoard: string;
  onSelect: (board: string) => void;
  onNext: (data: SprintFormData) => void;
};

const DialogSelectBoard = ({
  open,
  onOpenChange,
  selectedBoard,
  onSelect,
  onNext
}: DialogSelectBoardProps) => {
  const boards = boardTypes.retrospective;

  const form = useForm<SprintFormData>({
    resolver: zodResolver(sprintFormSchema),
    defaultValues: {
      sprintName: '',
      teamId: '',
      template: 'daki'
    }
  });

  const handleSubmit = (data: SprintFormData) => {
    // Include selected board in the form data
    const formData = {
      ...data,
      boardType: selectedBoard
    };
    onNext(formData);
  };

  const handleTeamChange = (teamId: string) => {
    form.setValue('teamId', teamId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className='min-w-3xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Select Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='h-full w-full'>
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

            <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
              {boards.map((board) => (
                <Card
                  key={board.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedBoard === board.id
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-200'
                  }`}
                  onClick={() => onSelect(board.id)}
                >
                  <CardContent className='p-4'>
                    {/* Preview Image Area */}
                    <div className='mb-4 flex aspect-video items-center justify-center rounded-lg bg-gray-100'>
                      <div className='text-gray-400'>
                        <board.icon className='h-12 w-12' />
                      </div>
                    </div>

                    {/* Board Type Info */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <board.icon className='h-5 w-5 text-blue-600' />
                        <h3 className='text-lg font-semibold'>{board.title}</h3>
                      </div>
                      <p className='text-sm leading-relaxed text-gray-600'>
                        {board.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <div className='mt-8 flex justify-end'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 hover:bg-blue-700'
                disabled={
                  !selectedBoard ||
                  !form.watch('teamId') ||
                  !form.watch('sprintName')
                }
              >
                Next
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSelectBoard;

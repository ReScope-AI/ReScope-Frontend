'use client';

import { Check, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useCreateSprint,
  useDeleteSprint,
  useGetSprintsByUser
} from '@/hooks/use-sprint-api';

import { useRetrospectiveStore } from '../stores';

interface SprintNameSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
}

const SprintNameSelector = ({
  value,
  onValueChange
}: SprintNameSelectorProps) => {
  const { sprints, removeSprint, setSprints } = useRetrospectiveStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sprintName, setSprintName] = useState('');

  // API hooks
  const {
    data: apiSprints,
    isLoading: isLoadingSprints,
    error: sprintsError
  } = useGetSprintsByUser();
  const createSprintMutation = useCreateSprint();
  const deleteSprintMutation = useDeleteSprint();

  // Sync API teams with local store
  useEffect(() => {
    if (apiSprints?.data) {
      const formattedSprints = apiSprints.data.map((sprint: any) => ({
        id: sprint.id || sprint._id,
        name: sprint.name
      }));
      setSprints(formattedSprints);
    }
  }, [apiSprints, setSprints]);

  const handleAddTeam = async () => {
    if (!sprintName.trim()) return;

    setIsLoading(true);
    try {
      const result = await createSprintMutation.mutateAsync({
        name: sprintName,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      });

      if (result?.data) {
        const newSprint = {
          id: result.data.id || result.data._id,
          name: result.data.name
        };

        setSprints([...sprints, newSprint]);

        setIsAdding(false);

        onValueChange(newSprint.id);

        setSprintName('');
      }
    } catch (error) {
      // Not need to notification error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleDeleteSprint = async (sprintId: string) => {
    try {
      await deleteSprintMutation.mutateAsync(sprintId);

      removeSprint(sprintId);

      if (value === sprintId) {
        onValueChange('');
      }
    } catch (error) {
      // Not need to show toast, because it already handled by the request configurate
    }
  };

  const selectedSprint = sprints.find((sprint) => sprint.id === value);

  if (isLoadingSprints) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='text-sm text-gray-500'>Loading sprints...</div>
      </div>
    );
  }

  if (sprintsError) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='text-sm text-red-500'>Failed to load sprints</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        {/* Teams list with scroll */}
        <div className='flex max-h-[200px] flex-col gap-1 overflow-y-auto'>
          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              className={`flex cursor-pointer items-center justify-between rounded-md border p-2 transition-colors ${
                value === sprint.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onValueChange(sprint.id)}
            >
              <span className='flex-1 text-sm'>{sprint.name}</span>
              <div className='flex items-center gap-1'>
                {value === sprint.id && (
                  <Check className='h-4 w-4 text-blue-500' />
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  type='button'
                  className='h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSprint(sprint.id);
                  }}
                  disabled={deleteSprintMutation.isPending}
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new team form */}
        {isAdding && (
          <div className='flex items-center gap-2 rounded-md border border-gray-200 p-2'>
            <Input
              placeholder='Enter sprint name...'
              className='flex-1'
              autoFocus
              disabled={isLoading}
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTeam();
                }
              }}
            />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-green-500 hover:bg-green-50 hover:text-green-700'
              disabled={isLoading}
              onClick={handleAddTeam}
            >
              <Check className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
              onClick={handleCancelAdd}
              disabled={isLoading}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        )}

        {/* Add button */}
        {!isAdding && (
          <Button
            variant='outline'
            size='default'
            type='button'
            className='w-full justify-start text-gray-500 hover:text-gray-700'
            onClick={() => setIsAdding(true)}
            disabled={createSprintMutation.isPending}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add new sprint
          </Button>
        )}
      </div>

      {/* Team count indicator */}
      {sprints.length > 0 && (
        <div className='text-xs text-gray-500'>
          {sprints.length} sprint{sprints.length !== 1 ? 's' : ''} available
        </div>
      )}

      {/* Display selected value */}
      {selectedSprint && (
        <div className='mt-1 text-sm text-gray-600'>
          Selected: <span className='font-medium'>{selectedSprint.name}</span>
        </div>
      )}
    </div>
  );
};

export default SprintNameSelector;

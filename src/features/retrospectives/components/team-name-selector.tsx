'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useCreateTeam,
  useDeleteTeam,
  useGetTeams
} from '@/hooks/use-team-api';
import { Check, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRetrospectiveStore } from '../utils/store';

interface TeamNameSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
}

const TeamNameSelector = ({ value, onValueChange }: TeamNameSelectorProps) => {
  const { teams, addTeam, removeTeam, setTeams } = useRetrospectiveStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teamName, setTeamName] = useState('');

  // API hooks
  const {
    data: apiTeams,
    isLoading: isLoadingTeams,
    error: teamsError
  } = useGetTeams();
  const createTeamMutation = useCreateTeam();
  const deleteTeamMutation = useDeleteTeam();

  // Sync API teams with local store
  useEffect(() => {
    if (apiTeams?.data) {
      const formattedTeams = apiTeams.data.map((team: any) => ({
        id: team.id || team._id,
        name: team.name
      }));
      setTeams(formattedTeams);
    }
  }, [apiTeams, setTeams]);

  const handleAddTeam = async () => {
    if (!teamName.trim()) return;

    setIsLoading(true);
    try {
      const result = await createTeamMutation.mutateAsync({
        name: teamName
      });

      if (result?.data) {
        const newTeam = {
          id: result.data.id || result.data._id,
          name: result.data.name
        };
        addTeam(newTeam.name);

        setIsAdding(false);

        onValueChange(newTeam.id);

        setTeamName('');
      }
    } catch (error) {
      toast.error('Failed to add team name');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeamMutation.mutateAsync(teamId);

      removeTeam(teamId);

      if (value === teamId) {
        onValueChange('');
      }
    } catch (error) {
      toast.error('Failed to delete team name');
    }
  };

  const selectedTeam = teams.find((team) => team.id === value);

  if (isLoadingTeams) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='text-sm text-gray-500'>Loading teams...</div>
      </div>
    );
  }

  if (teamsError) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='text-sm text-red-500'>Failed to load teams</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        {/* Teams list with scroll */}
        <div className='flex max-h-[200px] flex-col gap-1 overflow-y-auto p-2'>
          {teams.map((team) => (
            <div
              key={team.id}
              className={`flex cursor-pointer items-center justify-between rounded-md border p-2 transition-colors ${
                value === team.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onValueChange(team.id)}
            >
              <span className='flex-1 text-sm'>{team.name}</span>
              <div className='flex items-center gap-1'>
                {value === team.id && (
                  <Check className='h-4 w-4 text-blue-500' />
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  type='button'
                  className='h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTeam(team.id);
                  }}
                  disabled={deleteTeamMutation.isPending}
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
              placeholder='Enter team name...'
              className='flex-1'
              autoFocus
              disabled={isLoading}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
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
            disabled={createTeamMutation.isPending}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add new team
          </Button>
        )}
      </div>

      {/* Team count indicator */}
      {teams.length > 0 && (
        <div className='text-xs text-gray-500'>
          {teams.length} team{teams.length !== 1 ? 's' : ''} available
        </div>
      )}

      {/* Display selected value */}
      {selectedTeam && (
        <div className='mt-1 text-sm text-gray-600'>
          Selected: <span className='font-medium'>{selectedTeam.name}</span>
        </div>
      )}
    </div>
  );
};

export default TeamNameSelector;

'use client';
import React from 'react';
import { PollOption } from './types';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const OptionsManager = ({
  options,
  updateOption,
  removeOption,
  addOption
}: {
  options: PollOption[];
  updateOption: (id: string, text: string) => void;
  removeOption: (id: string) => void;
  addOption: () => void;
}) => {
  return (
    <div>
      <label className='mb-2 block text-xs font-medium tracking-wide text-gray-500 uppercase'>
        OPTIONS
      </label>
      <div className='space-y-2'>
        {options.map((option, index) => (
          <div key={option.id} className='flex items-center gap-2'>
            <GripVertical className='h-4 w-4 text-gray-400' />
            <Input
              value={option.text}
              onChange={(e) => updateOption(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className='flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => removeOption(option.id)}
              disabled={options.length <= 2}
              className='h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-500'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant='ghost'
        onClick={addOption}
        className='mt-2 text-purple-600 hover:bg-purple-50 hover:text-purple-700'
      >
        <Plus className='mr-1 h-4 w-4' />
        ADD OPTION
      </Button>
    </div>
  );
};

export default OptionsManager;

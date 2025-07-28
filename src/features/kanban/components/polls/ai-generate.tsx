import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Info, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';

const AIGenerator = ({
  isVisible,
  onClose
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [aiPrompt, setAiPrompt] = useState('');

  if (!isVisible) return null;
  return (
    <div className='rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm'>
      <div className='mb-4 flex items-center gap-2'>
        <Sparkles className='h-5 w-5 text-purple-600' />
        <h3 className='font-medium text-gray-900'>AI Poll Generator</h3>
        <Button
          variant='ghost'
          size='icon'
          onClick={onClose}
          className='ml-auto h-6 w-6'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      <div className='space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Generate Poll
          </label>
          <div className='relative'>
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder='Enter a prompt...'
              className='border-gray-300 pr-10 focus:border-purple-500 focus:ring-purple-500'
            />
            <Sparkles className='absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-purple-600' />
          </div>
        </div>

        <div className='rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-3'>
          <div className='flex gap-2'>
            <Info className='mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600' />
            <p className='text-sm text-blue-800'>
              Generate a poll using AI. Enter a prompt to generate a question
              and answers. Prompts can be as simple as &apos;happiness&apos;,
              &apos;team collaboration&apos;, or as complex as &apos;Create a
              funny poll to help us get to know each other&apos;.
            </p>
          </div>
        </div>

        <Button
          variant='outline'
          className='w-full border-purple-200 bg-white text-purple-600 hover:border-purple-300 hover:bg-purple-50'
        >
          <Sparkles className='mr-2 h-4 w-4' />
          Create random poll
        </Button>
      </div>
    </div>
  );
};

export default AIGenerator;

'use client';
import { Clipboard, Sparkles } from 'lucide-react';
import React from 'react';

import { showNotification } from '@/components/common';
import { Button } from '@/components/ui/button';

const PreDefinedPollsSection = ({
  showTemplateSelector,
  setShowTemplateSelector,
  showAIGenerator,
  setShowAIGenerator
}: {
  showTemplateSelector: boolean;
  setShowTemplateSelector: (show: boolean) => void;
  showAIGenerator: boolean;
  setShowAIGenerator: (show: boolean) => void;
}) => {
  return (
    <div>
      <label className='mb-3 block text-xs font-medium tracking-wide text-gray-500 uppercase'>
        PRE-DEFINED POLLS
      </label>
      <div className='flex gap-3'>
        <Button
          variant='outline'
          onClick={() =>
            showNotification('info', 'Feature will be available soon!')
          }
          className='flex-1 border-purple-200 text-purple-600 hover:border-purple-300 hover:bg-purple-50'
        >
          <Clipboard className='mr-2 h-4 w-4' />
          Select Template
        </Button>
        <Button
          variant='outline'
          onClick={() => setShowAIGenerator(!showAIGenerator)}
          className='flex-1 border-purple-200 text-purple-600 hover:border-purple-300 hover:bg-purple-50'
        >
          <Sparkles className='mr-2 h-4 w-4' />
          Generate with AI
        </Button>
      </div>
    </div>
  );
};

export default PreDefinedPollsSection;

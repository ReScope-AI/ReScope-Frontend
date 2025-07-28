'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { createPollQuestion } from '@/config/api/poll-question';
import { QUERY_CONSTANTS } from '@/constants/query';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { ICreatePollQuestion } from '@/types';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { usePollStore } from '@/stores/pollStore';
import { showNotification } from '@/components/common';
import { Poll, PollOption } from './types';
import AIGenerator from './ai-generate';
import TemplateSelector from './template-selector';
import OptionsManager from './options-manageger';
import PreDefinedPollsSection from './pre-defined-polls-section';
import { ChartGantt } from 'lucide-react';

const PollModal = () => {
  const retroSession = useRetroSessionStore((state) => state.retroSession);

  const [isOpen, setIsOpen] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);

  const queryClient = useQueryClient();
  const addPollsColumn = usePollStore((state) => state.addPollsColumn);

  const createPollMutation = useMutation({
    mutationFn: (data: ICreatePollQuestion) => createPollQuestion(data),
    onSuccess: (response) => {
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: [QUERY_CONSTANTS.RETRO_SESSION.GET_RETRO_SESSION_BY_ID]
      });
      addPollsColumn(response.data.text);
    },
    onError: (error) => {
      showNotification('error', error?.message || 'Something went wrong');
    }
  });

  const addOption = () => {
    const newOption: PollOption = {
      id: Date.now().toString(),
      text: ''
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const handleTemplateSelect = (selectedPoll: Poll) => {
    setQuestion(selectedPoll.question);
    setOptions(
      selectedPoll.options.map((opt, index) => ({
        id: (index + 1).toString(),
        text: opt
      }))
    );
  };

  const resetForm = () => {
    setQuestion('');
    setOptions([
      { id: '1', text: '' },
      { id: '2', text: '' }
    ]);
    setShowAIGenerator(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleSave = () => {
    const pollData: ICreatePollQuestion = {
      text: question,
      session_id: retroSession?._id || '',
      criterion: 'communication',
      options: options
        .map((opt) => opt.text)
        .filter((text) => text.trim() !== '')
    };
    createPollMutation.mutate(pollData);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md'
              >
                <ChartGantt className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create short poll for every one to answer</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>

        <DialogContent className='max-w-lg p-0 shadow-2xl'>
          <DialogHeader className='p-6 pb-0'>
            <div className='flex items-center justify-between'>
              <DialogTitle className='text-xl font-bold text-gray-900'>
                Create Poll
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className='space-y-6 px-6 pb-6'>
            <div>
              <label className='mb-2 block text-xs font-medium tracking-wide text-gray-500 uppercase'>
                QUESTION
              </label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder='Enter a question'
                className='border-gray-300 focus:border-purple-500 focus:ring-purple-500'
              />
            </div>

            <OptionsManager
              options={options}
              updateOption={updateOption}
              removeOption={removeOption}
              addOption={addOption}
            />

            <AIGenerator
              isVisible={showAIGenerator}
              onClose={() => setShowAIGenerator(false)}
            />

            <PreDefinedPollsSection
              showTemplateSelector={showTemplateSelector}
              setShowTemplateSelector={setShowTemplateSelector}
              showAIGenerator={showAIGenerator}
              setShowAIGenerator={setShowAIGenerator}
            />

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4'>
              <Button
                variant='outline'
                onClick={() => setIsOpen(false)}
                className='flex-1 border-purple-200 text-purple-600 hover:border-purple-300 hover:bg-purple-50'
              >
                CANCEL
              </Button>
              <Button
                onClick={handleSave}
                disabled={createPollMutation.isPending}
                className='flex-1 bg-purple-600 shadow-lg hover:bg-purple-700'
              >
                {createPollMutation.isPending ? 'SAVING...' : 'SAVE'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
      />
    </>
  );
};

export default PollModal;

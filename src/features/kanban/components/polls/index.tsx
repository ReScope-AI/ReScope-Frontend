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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { usePollStore } from '@/stores/pollStore';
import type { Poll, PollOption } from './types';
import AIGeneratorModal from './ai-generate';
import TemplateSelector from './template-selector';
import OptionsManager from './options-manageger';
import PreDefinedPollsSection from './pre-defined-polls-section';
import { GanttChartIcon as ChartGantt } from 'lucide-react';
import { usePollModal } from './usePollModal';

const PollModal = () => {
  const addPollsColumn = usePollStore((state) => state.addPollsColumn);
  const {
    isOpen,
    setIsOpen,
    showAIGenerator,
    setShowAIGenerator,
    showTemplateSelector,
    setShowTemplateSelector,
    question,
    setQuestion,
    criterion,
    setCriterion,
    options,
    addOption,
    removeOption,
    updateOption,
    handleAIGeneratedPoll,
    resetForm,
    handleSave,
    isLoading
  } = usePollModal();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <>
      <TooltipProvider>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsOpen(true)}
                  className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                >
                  <ChartGantt className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create short poll for every one to answer</p>
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent className='max-w-lg p-0 shadow-2xl dark:bg-gray-900'>
            <DialogHeader className='p-6 pb-0'>
              <div className='flex items-center justify-between'>
                <DialogTitle className='text-xl font-bold text-gray-900 dark:text-white'>
                  Create Poll
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className='space-y-6 px-6 pb-6'>
              <div>
                <label className='mb-2 block text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400'>
                  QUESTION
                </label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder='Enter a question'
                  className='border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                />
              </div>

              <div>
                <label className='mb-2 block text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400'>
                  CRITERION
                </label>
                <select
                  value={criterion}
                  onChange={(e) => setCriterion(e.target.value)}
                  className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                >
                  <option value='communication'>Communication</option>
                  <option value='quality'>Quality</option>
                  <option value='process'>Process</option>
                  <option value='estimate'>Estimate</option>
                  <option value='timebound'>Time Bound</option>
                </select>
              </div>

              <OptionsManager
                options={options}
                updateOption={updateOption}
                removeOption={removeOption}
                addOption={addOption}
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
                  className='flex-1 border-purple-200 text-purple-600 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20'
                >
                  CANCEL
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className='flex-1 bg-purple-600 shadow-lg hover:bg-purple-700'
                >
                  {isLoading ? 'SAVING...' : 'SAVE'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>

      <TemplateSelector
        open={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        categories={[]}
        selectedCategory={null}
        setSelectedCategory={() => {}}
      />

      <AIGeneratorModal
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onGenerate={handleAIGeneratedPoll}
      />
    </>
  );
};

export default PollModal;

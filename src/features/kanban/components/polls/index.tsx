'use client';

import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { GanttChartIcon as ChartGantt, Sparkles } from 'lucide-react';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';

import { useTaskStore } from '../../utils/store';

import AIGeneratorModal from './ai-generate';
import OptionsManager from './options-manageger';
import PreDefinedPollsSection from './pre-defined-polls-section';
import TemplateSelector from './template-selector';
import { usePollModal } from './usePollModal';

const PollModal = () => {
  const step = useTaskStore((state) => state.step);
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

  const criterionOptions = [
    { value: 'communication', label: 'Communication', icon: '💬' },
    { value: 'quality', label: 'Quality', icon: '⭐' },
    { value: 'process', label: 'Process', icon: '⚙️' },
    { value: 'estimate', label: 'Estimate', icon: '📊' },
    { value: 'timebound', label: 'Time Bound', icon: '⏰' }
  ];

  return (
    <>
      <TooltipProvider>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={() => setIsOpen(true)}
                    disabled={step !== 1}
                    className='group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-purple-300 hover:from-purple-50 hover:to-slate-100 hover:text-purple-600 hover:shadow-xl dark:border-slate-700/60 dark:from-slate-800 dark:to-slate-900 dark:text-slate-400 dark:hover:border-purple-600 dark:hover:from-purple-900/20 dark:hover:to-slate-800 dark:hover:text-purple-400'
                  >
                    <ChartGantt className='h-5 w-5 transition-transform duration-300 group-hover:rotate-12' />
                    <div className='absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20' />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              >
                {step !== 1 ? (
                  <p className='font-medium'>
                    You can only create poll in step Reflect
                  </p>
                ) : (
                  <>
                    <p className='font-medium'>Create Poll</p>
                    <p className='text-xs opacity-80'>
                      Create short poll for everyone to answer
                    </p>
                  </>
                )}
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>

          <DialogContent className='flex h-[600px] max-w-2xl flex-col overflow-hidden border-0 bg-white p-0 shadow-2xl dark:bg-slate-900'>
            {/* Header with gradient background */}
            <div className='relative flex-shrink-0 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 px-6 py-8'>
              <div className='absolute inset-0 bg-black/10' />
              <div className='relative'>
                <DialogHeader className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
                        <ChartGantt className='h-6 w-6 text-white' />
                      </div>
                      <div>
                        <DialogTitle className='text-2xl font-bold text-white'>
                          Create Poll
                        </DialogTitle>
                        <p className='text-purple-100'>
                          Design engaging polls for your team
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </div>
              {/* Decorative elements */}
              <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl' />
              <div className='absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl' />
            </div>

            {/* Scrollable Content */}
            <div className='flex-1 overflow-y-auto'>
              <div className='space-y-8 px-6 py-8'>
                {/* Question Section */}
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-purple-500' />
                    <label className='text-sm font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300'>
                      Question
                    </label>
                  </div>
                  <div className='relative'>
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder='What would you like to ask your team?'
                      className='h-12 border-slate-200 bg-slate-50/50 text-base placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-slate-800 dark:focus:ring-purple-900/20'
                    />
                    <div className='pointer-events-none absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0' />
                  </div>
                </div>

                {/* Criterion Section */}
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-blue-500' />
                    <label className='text-sm font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300'>
                      Category
                    </label>
                  </div>
                  <Select value={criterion} onValueChange={setCriterion}>
                    <SelectTrigger className='h-12 border-slate-200 bg-slate-50/50 text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/20'>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                    <SelectContent className='border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'>
                      {criterionOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className='cursor-pointer hover:bg-slate-50 focus:bg-slate-50 dark:hover:bg-slate-700 dark:focus:bg-slate-700'
                        >
                          <div className='flex items-center gap-3'>
                            <span className='text-lg'>{option.icon}</span>
                            <span className='font-medium'>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Options Section */}
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-green-500' />
                    <label className='text-sm font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300'>
                      Options
                    </label>
                  </div>
                  <div className='rounded-xl border border-slate-200 bg-slate-50/30 p-4 dark:border-slate-700 dark:bg-slate-800/30'>
                    <OptionsManager
                      options={options}
                      updateOption={updateOption}
                      removeOption={removeOption}
                      addOption={addOption}
                    />
                  </div>
                </div>

                {/* Pre-defined Polls Section */}
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-amber-500' />
                    <label className='text-sm font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300'>
                      Quick Start
                    </label>
                  </div>
                  <div className='rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900/50'>
                    <PreDefinedPollsSection
                      showTemplateSelector={showTemplateSelector}
                      setShowTemplateSelector={setShowTemplateSelector}
                      showAIGenerator={showAIGenerator}
                      setShowAIGenerator={setShowAIGenerator}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='flex-shrink-0 border-t border-slate-200 bg-slate-50/50 px-6 py-6 dark:border-slate-700 dark:bg-slate-800/50'>
              <div className='flex gap-4'>
                <Button
                  variant='outline'
                  onClick={() => setIsOpen(false)}
                  className='h-12 flex-1 border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !question.trim()}
                  className='h-12 flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isLoading ? (
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                      Saving...
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <Sparkles className='h-4 w-4' />
                      Create Poll
                    </div>
                  )}
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

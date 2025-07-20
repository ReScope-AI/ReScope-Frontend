'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import {
  BarChart3,
  Calendar,
  ChartGantt,
  Check,
  Clipboard,
  GripVertical,
  Info,
  Plus,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';

interface PollOption {
  id: string;
  text: string;
}

interface Poll {
  id: string;
  question: string;
  options: string[];
  date?: string;
}

const defaultPolls: Poll[] = [
  {
    id: '1',
    question: 'How are you feeling today?',
    options: ['Fantastic', 'Good', 'Okay', 'Bad', 'Pretty Bad']
  },
  {
    id: '2',
    question:
      'How would you rate our team collaboration and communication in this sprint?',
    options: ['Excellent', 'Good', 'Average', 'Poor']
  },
  {
    id: '3',
    question: 'To what extent did we achieve our sprint goals?',
    options: [
      'Fully achieved',
      'Mostly achieved',
      'Partially achieved',
      'Not achieved'
    ]
  },
  {
    id: '4',
    question: 'What was the biggest obstacle faced during this sprint?',
    options: [
      'Technical challenges',
      'Resource constraints',
      'Communication issues',
      'Scope changes'
    ]
  },
  {
    id: '5',
    question:
      'What should be our primary focus for improvement in the next sprint?',
    options: [
      'Code quality',
      'Team communication',
      'Process efficiency',
      'Technical skills'
    ]
  },
  {
    id: '6',
    question:
      'How do you rate the clarity and understanding of the sprint objectives?',
    options: ['Very clear', 'Mostly clear', 'Somewhat unclear', 'Very unclear']
  }
];

const previousPolls: Poll[] = [
  {
    id: 'prev1',
    question: 'Create Poll',
    options: ['Option A', 'Option B'],
    date: 'Sun, Jul 13, 2025'
  }
];

// Template Selector Component
function TemplateSelector({
  isOpen,
  onClose,
  onSelect
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (poll: Poll) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState('Default Polls');
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  const getCurrentPolls = () => {
    switch (selectedCategory) {
      case 'Default Polls':
        return defaultPolls;
      case 'Previous Polls':
        return previousPolls;
      case 'AI Generated Polls':
        return [];
      default:
        return defaultPolls;
    }
  };

  const handleSelect = () => {
    if (selectedPoll) {
      onSelect(selectedPoll);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[600px] max-w-6xl p-0'>
        <div className='flex h-full'>
          {/* Categories Sidebar */}
          <div className='w-64 border-r bg-gradient-to-b from-gray-50 to-gray-100 p-4'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='font-semibold text-gray-900'>Select Poll</h3>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='h-6 w-6 hover:bg-gray-200'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
            <p className='mb-6 text-sm text-gray-600'>
              Select an existing poll to use in your retro
            </p>

            <div className='space-y-1'>
              <h4 className='mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase'>
                CATEGORY
              </h4>
              {['Default Polls', 'Previous Polls', 'AI Generated Polls'].map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedPoll(null);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'Default Polls' && (
                      <Clipboard className='h-4 w-4' />
                    )}
                    {category === 'Previous Polls' && (
                      <Calendar className='h-4 w-4' />
                    )}
                    {category === 'AI Generated Polls' && (
                      <Sparkles className='h-4 w-4' />
                    )}
                    {category}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Polls List */}
          <div className='flex-1 p-4'>
            <h4 className='mb-4 text-xs font-medium tracking-wide text-gray-500 uppercase'>
              {selectedCategory.toUpperCase()}
            </h4>

            {getCurrentPolls().length === 0 ? (
              <div className='py-12 text-center'>
                <Sparkles className='mx-auto mb-4 h-12 w-12 text-gray-300' />
                <h3 className='mb-2 text-lg font-medium text-gray-900'>
                  No AI Generated Polls Found
                </h3>
                <p className='text-gray-600'>
                  Polls that you have previously generated with AI will show up
                  here.
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {getCurrentPolls().map((poll) => (
                  <button
                    key={poll.id}
                    onClick={() => setSelectedPoll(poll)}
                    className={`w-full rounded-lg border p-4 text-left transition-all duration-200 hover:shadow-md ${
                      selectedPoll?.id === poll.id
                        ? 'border-purple-300 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='font-medium text-gray-900'>
                      {poll.question}
                    </div>
                    {poll.date && (
                      <div className='mt-2 flex items-center gap-1 text-xs text-gray-500'>
                        <Calendar className='h-3 w-3' />
                        {poll.date}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Poll Preview */}
          <div className='w-80 border-l bg-gradient-to-b from-gray-50 to-gray-100 p-4'>
            <h4 className='mb-4 text-xs font-medium tracking-wide text-gray-500 uppercase'>
              SELECTED POLL
            </h4>

            {selectedPoll ? (
              <div className='rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm'>
                <div className='mb-3 flex items-center gap-2'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-sm'>
                    <Check className='h-3 w-3 text-white' />
                  </div>
                  <h3 className='font-medium text-blue-900'>
                    {selectedPoll.question}
                  </h3>
                </div>

                <ul className='mb-4 space-y-2'>
                  {selectedPoll.options.map((option, index) => (
                    <li
                      key={index}
                      className='flex items-center gap-2 text-sm text-blue-800'
                    >
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 text-xs font-medium'>
                        {index + 1}
                      </div>
                      {option}
                    </li>
                  ))}
                </ul>

                {selectedPoll.date && (
                  <div className='flex items-center gap-1 text-xs text-blue-600'>
                    <Calendar className='h-3 w-3' />
                    {selectedPoll.date}
                  </div>
                )}
              </div>
            ) : (
              <div className='py-8 text-center text-gray-500'>
                <BarChart3 className='mx-auto mb-2 h-8 w-8 text-gray-300' />
                Select a poll to see preview
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 border-t bg-gray-50 p-4'>
          <Button variant='outline' onClick={onClose}>
            CANCEL
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedPoll}
            className='bg-purple-600 hover:bg-purple-700'
          >
            <Check className='mr-2 h-4 w-4' />
            SELECT POLL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// AI Generator Component
function AIGenerator({
  isVisible,
  onClose
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
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
}

// Main Poll Modal Component
export default function PollModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);
  const [anonymousVoting, setAnonymousVoting] = useState(false);
  const [autoReveal, setAutoReveal] = useState(true);

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
    setAnonymousVoting(false);
    setAutoReveal(true);
    setShowAIGenerator(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className='cursor-pointer bg-purple-600 text-white shadow-lg transition-all duration-200 hover:bg-purple-700 hover:shadow-xl'
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
            {/* Question Section */}
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

            {/* Options Section */}
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

            {/* Settings Section */}
            <div>
              <label className='mb-3 block text-xs font-medium tracking-wide text-gray-500 uppercase'>
                SETTINGS
              </label>
              <div className='space-y-3'>
                <div className='flex items-start space-x-3'>
                  <Checkbox
                    id='anonymous'
                    checked={anonymousVoting}
                    onCheckedChange={(checked) =>
                      setAnonymousVoting(checked === true)
                    }
                    className='data-[state=checked]:border-purple-600 data-[state=checked]:bg-purple-600'
                  />
                  <div className='grid gap-1.5 leading-none'>
                    <label
                      htmlFor='anonymous'
                      className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      Anonymous Voting
                    </label>
                    <p className='text-xs text-gray-600'>
                      Voters will be anonymous.
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <Checkbox
                    id='autoreveal'
                    checked={autoReveal}
                    onCheckedChange={(checked) =>
                      setAutoReveal(checked === true)
                    }
                    className='data-[state=checked]:border-purple-600 data-[state=checked]:bg-purple-600'
                  />
                  <div className='grid gap-1.5 leading-none'>
                    <label
                      htmlFor='autoreveal'
                      className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      Auto Reveal
                    </label>
                    <p className='text-xs text-gray-600'>
                      Results are visible after voting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Generator Section */}
            <AIGenerator
              isVisible={showAIGenerator}
              onClose={() => setShowAIGenerator(false)}
            />

            {/* Pre-defined Polls Section */}
            <div>
              <label className='mb-3 block text-xs font-medium tracking-wide text-gray-500 uppercase'>
                PRE-DEFINED POLLS
              </label>
              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setShowTemplateSelector(true)}
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

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4'>
              <Button
                variant='outline'
                onClick={() => setIsOpen(false)}
                className='flex-1 border-purple-200 text-purple-600 hover:border-purple-300 hover:bg-purple-50'
              >
                CANCEL
              </Button>
              <Button className='flex-1 bg-purple-600 shadow-lg hover:bg-purple-700'>
                SAVE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
      />
    </>
  );
}

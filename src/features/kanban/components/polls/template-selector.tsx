'use client';
import React, { useState } from 'react';
import { Poll } from './types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Calendar,
  Check,
  Clipboard,
  Sparkles,
  X
} from 'lucide-react';

const TemplateSelector = ({
  isOpen,
  onClose,
  onSelect
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (poll: Poll) => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Default Polls');
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

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
                        ? 'shadow- sm bg-purple-100 text-purple-700'
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
            {/* Poll list content would go here */}
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
};

export default TemplateSelector;

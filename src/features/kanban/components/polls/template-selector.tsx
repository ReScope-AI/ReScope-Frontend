'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

// Define the missing types
interface Category {
  id: string;
  name: string;
  polls: Poll[];
}

interface Poll {
  id: string;
  title: string;
  description?: string;
  options: string[];
}

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

// Simple PollPreview component
const PollPreview: React.FC<{
  poll: Poll;
  onClick: () => void;
  isSelected: boolean;
}> = ({ poll, onClick, isSelected }) => {
  return (
    <div
      className={`mb-3 cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
        isSelected
          ? 'border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
      }`}
      onClick={onClick}
    >
      <h3 className='font-medium text-gray-900 dark:text-white'>
        {poll.title}
      </h3>
      {poll.description && (
        <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
          {poll.description}
        </p>
      )}
      <div className='mt-2'>
        <p className='text-xs text-gray-500 dark:text-gray-500'>Options:</p>
        <div className='mt-1 space-y-1'>
          {poll.options.map((option, index) => (
            <div
              key={index}
              className='text-xs text-gray-600 dark:text-gray-300'
            >
              • {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  open,
  onClose,
  categories,
  selectedCategory,
  setSelectedCategory
}) => {
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='h-[600px] max-w-6xl p-0'>
        <DialogTitle className='p-6 text-gray-900 dark:text-white'>
          Select a Poll Template
        </DialogTitle>
        <div className='flex h-full'>
          <div className='w-64 border-r bg-gradient-to-b from-gray-50 to-gray-100 p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900'>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-purple-100 text-purple-700 shadow-sm dark:bg-purple-900/30 dark:text-purple-300'
                    : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </div>
            ))}
          </div>
          <div className='w-80 border-l bg-gradient-to-b from-gray-50 to-gray-100 p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900'>
            {selectedCategory && (
              <div>
                {selectedCategory.polls.map((poll: Poll) => (
                  <PollPreview
                    key={poll.id}
                    poll={poll}
                    onClick={() => setSelectedPoll(poll)}
                    isSelected={selectedPoll === poll}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className='flex justify-end gap-3 border-t bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Select</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;

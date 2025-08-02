import { Active, DataRef, Over } from '@dnd-kit/core';
import {
  IconPlus,
  IconMinus,
  IconRotate360,
  IconSettings,
  IconChartHistogram
} from '@tabler/icons-react';

import { IOption, IQuestion } from '@/types';

import { ColumnDragData } from '../components/board-column';
import { TaskDragData } from '../components/task-card';

type DraggableData = ColumnDragData | TaskDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

export const getColumnIcon = (icon: string) => {
  switch (icon) {
    case 'minus':
      return <IconMinus className='h-4 w-4' />;
    case 'plus':
      return <IconPlus className='h-4 w-4' />;
    case 'loop':
      return <IconRotate360 className='h-4 w-4' />;
    case 'gear':
      return <IconSettings className='h-4 w-4' />;
    case 'chart':
      return <IconChartHistogram className='h-4 w-4' />;
    default:
      return <IconPlus className='h-4 w-4' />;
  }
};

export const getColumnColorClasses = (color: string) => {
  switch (color) {
    case 'red':
      return {
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
        icon: 'text-red-600 dark:text-red-400'
      };
    case 'green':
      return {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
        icon: 'text-green-600 dark:text-green-400'
      };
    case 'orange':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-300',
        icon: 'text-orange-600 dark:text-orange-400'
      };
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-950/20',
        border: 'border-gray-200 dark:border-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        icon: 'text-gray-600 dark:text-gray-400'
      };
  }
};

export const convertData = (questions: IQuestion[]) => {
  return questions.map((question: IQuestion) => {
    // Calculate total votes
    const totalVotes = question.options.reduce(
      (sum: number, option: IOption) => sum + option.votes.length,
      0
    );

    // Convert options to new format
    const options = question.options.map((option) => {
      const voteCount = option.votes.length;
      const percentage =
        totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
      return {
        text: option.text,
        percentage
      };
    });

    // Return object with expected structure
    return {
      question_text: question.text,
      criterion: question.criterion,
      options
    };
  });
};

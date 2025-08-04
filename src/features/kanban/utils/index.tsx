import { Active, DataRef, Over } from '@dnd-kit/core';
import {
  IconChartHistogram,
  IconMinus,
  IconPlus,
  IconRotate360,
  IconSettings
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

// Function to map category names to display properties
export const getCategoryProperties = (name: string) => {
  const categoryMap: Record<
    string,
    { title: string; color: string; icon: string; question: string }
  > = {
    DROP: {
      title: 'Drop',
      question: 'What practices should we stop or discontinue?',
      color: 'red',
      icon: 'minus'
    },
    ADD: {
      title: 'Add',
      question: 'What new practices should we adopt?',
      color: 'green',
      icon: 'plus'
    },
    KEEP: {
      title: 'Keep',
      question: "What's working well that we should continue?",
      color: 'green',
      icon: 'loop'
    },
    IMPROVE: {
      title: 'Improve',
      question: 'What could we do better?',
      color: 'orange',
      icon: 'gear'
    }
  };

  return (
    categoryMap[name] || {
      title: name,
      question: `What about ${name}?`,
      color: 'gray',
      icon: 'default'
    }
  );
};

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

export const getTaskColorClasses = (status: string) => {
  switch (status) {
    case 'DROP':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        badge: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
      };
    case 'ADD':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        badge:
          'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
      };
    case 'KEEP':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        badge:
          'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
      };
    case 'IMPROVE':
      return {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-800 dark:text-orange-200',
        badge:
          'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        border: 'border-gray-200 dark:border-gray-800',
        text: 'text-gray-800 dark:text-gray-200',
        badge: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
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

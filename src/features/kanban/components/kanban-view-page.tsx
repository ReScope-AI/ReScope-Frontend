'use client';
import {
  BarChart3,
  CreditCard,
  Filter,
  Loader2,
  MessageCircle,
  MessageSquareMore,
  RotateCcw,
  Search,
  SortAsc,
  SquarePen,
  ThumbsUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { emit, on } from '@/lib/retro-socket';
import { useRetroSessionStore } from '@/stores/retroSessionStore';

import { Status, useTaskStore } from '../utils/store';

import { KanbanBoard } from './kanban-board';
import NewTaskDialog from './new-task-dialog';
import PollModal from './polls';
import RadarChartDialog from './radar-chart-dialog';

const exampleRequestData = [
  {
    question_text:
      'How effectively did our daily stand-ups contribute to sprint progress?',
    criterion: 'PROCESS',
    options: [
      {
        text: 'Very Ineffective',
        percentage: 15
      },
      {
        text: 'Ineffective',
        percentage: 25
      },
      {
        text: 'Neutral',
        percentage: 20
      },
      {
        text: 'Effective',
        percentage: 30
      },
      {
        text: 'Very Effective',
        percentage: 10
      }
    ]
  },
  {
    question_text: 'How clear was the sprint goal for everyone?',
    criterion: 'GOAL',
    options: [
      {
        text: 'Not at all',
        percentage: 5
      },
      {
        text: 'Slightly',
        percentage: 15
      },
      {
        text: 'Moderately',
        percentage: 30
      },
      {
        text: 'Very',
        percentage: 40
      },
      {
        text: 'Extremely',
        percentage: 10
      }
    ]
  },
  {
    question_text:
      'Which of the following best describes how we should handle our sprint retrospective format?',
    criterion: 'DAKI_ACTION',
    options: [
      {
        text: 'Drop the current whiteboard tool for retros',
        percentage: 10
      },
      {
        text: "Add a dedicated 'Definition of Done' review in sprint planning",
        percentage: 25
      },
      {
        text: 'Keep our current daily stand-up time',
        percentage: 15
      },
      {
        text: 'Improve cross-functional communication during feature development',
        percentage: 50
      }
    ]
  },
  {
    question_text:
      'Rate the overall team collaboration during the last sprint.',
    criterion: 'TEAMWORK',
    options: [
      {
        text: 'Very Poor',
        percentage: 5
      },
      {
        text: 'Poor',
        percentage: 5
      },
      {
        text: 'Neutral',
        percentage: 20
      },
      {
        text: 'Good',
        percentage: 40
      },
      {
        text: 'Excellent',
        percentage: 30
      }
    ]
  },
  {
    question_text:
      'How satisfied are you with the support received from other team members?',
    criterion: 'COMMUNICATION',
    options: [
      {
        text: 'Very Unclear',
        percentage: 2
      },
      {
        text: 'Unclear',
        percentage: 8
      },
      {
        text: 'Neutral',
        percentage: 15
      },
      {
        text: 'Clear',
        percentage: 45
      },
      {
        text: 'Very Clear',
        percentage: 30
      }
    ]
  }
];

export default function KanbanViewPage({ retroId }: { retroId: string }) {
  const setPlanItemAction = useTaskStore((state) => state.setPlanItemAction);
  const planItemAction = useTaskStore((state) => state.planItemAction);
  const setTasks = useTaskStore((state) => state.setTasks);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRadarChartOpen, setIsRadarChartOpen] = useState(false);

  useEffect(() => {
    on('generate-plan-items', (data) => {
      if (data && data.data) {
        setPlanItemAction(data.data);
      }
      setIsGenerating(false);
    });
  }, []);

  const handleTestMessage = () => {
    setIsGenerating(true);
    emit('re-scope', {
      event: 'generate-plan-items',
      room: retroId,
      data: exampleRequestData
    });
  };

  useEffect(() => {
    if (planItemAction && planItemAction.length > 0) {
      setTasks(
        planItemAction.map((item) => ({
          _id: uuidv4(),
          title: item.description,
          status: item.action_type as Status,
          votes: 0
        }))
      );
    }
  }, [planItemAction]);

  return (
    <div className='relative flex h-full flex-col'>
      {/* Loading Overlay */}
      {isGenerating && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800'>
            <div className='flex flex-col items-center space-y-4'>
              <Loader2 className='h-12 w-12 animate-spin' />
              <div className='text-center'>
                <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100'>
                  Generating Plan Items
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  AI is analyzing your retrospective data...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <HeaderBar onOpenRadarChart={() => setIsRadarChartOpen(true)} />

      <Button
        className='mx-4 mt-4 w-48'
        onClick={handleTestMessage}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Generating...
          </>
        ) : (
          'Generate Plan Items'
        )}
      </Button>

      <div className='flex-shrink-0'>
        <NewTaskDialog />
      </div>

      <div className='flex-1 overflow-hidden'>
        <KanbanBoard />
      </div>

      {/* Radar Chart Dialog */}
      <RadarChartDialog
        open={isRadarChartOpen}
        onOpenChange={setIsRadarChartOpen}
      />
    </div>
  );
}

export function HeaderBar({
  onOpenRadarChart
}: {
  onOpenRadarChart: () => void;
}) {
  const retroSession = useRetroSessionStore((state) => state.retroSession);
  return (
    <div className='mt-4 flex w-full items-center justify-between space-x-2 border-b border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900'>
      {/* Left section */}
      <div className='flex items-center gap-2'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
          {retroSession?.name}
        </h2>
      </div>

      {/* Right section */}
      <div className='flex items-center gap-3'>
        <Button className='flex cursor-pointer items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-700 shadow-sm transition-all duration-200 hover:bg-green-100 hover:shadow-md dark:border-green-700 dark:bg-green-950/20 dark:text-green-300 dark:hover:bg-green-950/40'>
          <ThumbsUp className='h-4 w-4' />
          <span className='text-sm font-medium'>24</span>
        </Button>

        <Button className='flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700 shadow-sm transition-all duration-200 hover:bg-blue-100 hover:shadow-md dark:border-blue-700 dark:bg-blue-950/20 dark:text-blue-300 dark:hover:bg-blue-950/40'>
          <MessageSquareMore className='h-4 w-4' />
          <span className='text-sm font-medium'>6</span>
        </Button>

        <div className='relative'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500' />
          <input
            type='text'
            placeholder='Search items...'
            className='h-10 w-64 rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400'
          />
        </div>

        <Button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
          <CreditCard className='h-4 w-4' />
        </Button>

        <Button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
          <SortAsc className='h-4 w-4' />
        </Button>

        <Button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
          <Filter className='h-4 w-4' />
        </Button>

        <Button
          className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          onClick={onOpenRadarChart}
          title='View Performance Chart'
        >
          <BarChart3 className='h-4 w-4' />
        </Button>

        <PollModal />

        <div className='mx-2 h-8 w-px bg-gray-300 dark:bg-gray-600' />

        <Button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
          <RotateCcw className='h-4 w-4' />
        </Button>

        <Button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
          <SquarePen className='h-4 w-4' />
        </Button>

        <Button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
          <MessageCircle className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

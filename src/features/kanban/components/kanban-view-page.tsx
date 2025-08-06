'use client';
import {
  BarChart3,
  Download,
  Filter,
  Loader2,
  MessageSquareMore,
  Search,
  Share,
  SortAsc,
  SquarePen,
  ThumbsUp,
  UserRoundPlus
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { InviteRetroDialog } from '@/components/modal/invite-retro-dialog';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useGetCategories } from '@/hooks/use-category-api';
import { useDownloadRetroSession } from '@/hooks/use-retro-session-api';
import {
  emitGeneratePlanItems,
  onActiveGeneratePlanItems
} from '@/lib/retro-socket';
import { usePollStore } from '@/stores/pollStore';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { useUserStore } from '@/stores/userStore';

import { convertData } from '../utils';
import { useTaskStore } from '../utils/store';

import DrawerActionItemContent from './action-items/drawer-action-item-content';
import { KanbanBoard } from './kanban-board';
import NewTaskDialog from './new-task-dialog';
import PollModal from './polls';
import RadarChartDialog from './radar-chart-dialog';
import RetroSummary from './summary/retro-summary';

export default function KanbanViewPage({ retroId }: { retroId: string }) {
  const [isRadarChartOpen, setIsRadarChartOpen] = useState(false);

  const step = useTaskStore((state) => state.step);
  const retroSession = useRetroSessionStore((state) => state.retroSession);
  const pollQuestions = usePollStore((state) => state.pollQuestions);
  const setIsGenerating = useTaskStore((state) => state.setIsGenerating);
  const setTasks = useTaskStore((state) => state.setTasks);
  const tasks = useTaskStore((state) => state.tasks);

  useEffect(() => {
    const isGenerated = tasks.some((task) => task.isAIGenerate);
    if (
      step === 2 &&
      pollQuestions &&
      pollQuestions?.length > 0 &&
      retroSession?.plans?.length === 0
    ) {
      const mappedQuestions = convertData(pollQuestions);
      setIsGenerating(true);
      console.log('Emitting generate-plan-items', mappedQuestions);
      emitGeneratePlanItems(retroId || '', mappedQuestions);
    }
  }, [step, pollQuestions]);

  useEffect(() => {
    onActiveGeneratePlanItems((data) => {
      if (data.code === 200) {
        setIsGenerating(true);
      } else {
        toast.error(data.msg);
      }
    });
  }, []);

  useEffect(() => {
    if (retroSession?.plans && retroSession?.plans?.length > 0) {
      setTasks(
        retroSession?.plans?.map((plan) => ({
          _id: plan?._id || uuidv4(),
          title: plan.text,
          status: plan?.category_id,
          votes: 0
        })) || []
      );
    }
  }, [retroSession?.plans, setTasks]);

  return (
    <div className='relative flex h-full flex-col'>
      {/* Header Section */}
      <HeaderBar
        onOpenRadarChart={() => setIsRadarChartOpen(true)}
        retroId={retroId}
      />

      <div className='flex-shrink-0'>
        <NewTaskDialog />
      </div>

      {step === 3 ? (
        <RetroSummary />
      ) : (
        <div className='flex-1 overflow-hidden'>
          <KanbanBoard />
        </div>
      )}

      {/* Radar Chart Dialog */}
      <RadarChartDialog
        open={isRadarChartOpen}
        onOpenChange={setIsRadarChartOpen}
      />
    </div>
  );
}

export function HeaderBar({
  onOpenRadarChart,
  retroId
}: {
  onOpenRadarChart: () => void;
  retroId: string;
}) {
  const retroSession = useRetroSessionStore((state) => state.retroSession);
  const user = useUserStore((state) => state.user);
  const isOwner = user?._id === retroSession?.created_by;
  const step = useTaskStore((state) => state.step);
  const { mutate: downloadRetroSession, isPending: isDownloading } =
    useDownloadRetroSession();

  let stepName = '';
  if (step === 1) {
    stepName = 'Reflect';
  } else if (step === 2) {
    stepName = 'Discuss';
  } else if (step === 3) {
    stepName = 'Summary';
  }

  const isActiveRadarChart = useMemo(() => {
    return (
      retroSession?.radar_criteria?.length &&
      retroSession?.radar_criteria?.length > 0
    );
  }, [retroSession?.radar_criteria]);

  return (
    <div className='text-md flex w-full items-center justify-between space-x-2 border-b px-4 py-2'>
      {/* Left section */}
      <div className='flex items-center gap-2'>
        <h2 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
          {retroSession?.name} - {stepName}
        </h2>
      </div>

      {/* Right section */}
      <div className='flex items-center gap-3'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className='flex cursor-pointer items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-700 shadow-sm transition-all duration-200 hover:bg-green-100 hover:shadow-md dark:border-green-700 dark:bg-green-950/20 dark:text-green-300 dark:hover:bg-green-950/40'>
              <ThumbsUp className='h-4 w-4' />
              <span className='text-sm font-medium'>24</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total votes</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className='flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700 shadow-sm transition-all duration-200 hover:bg-blue-100 hover:shadow-md dark:border-blue-700 dark:bg-blue-950/20 dark:text-blue-300 dark:hover:bg-blue-950/40'>
              <MessageSquareMore className='h-4 w-4' />
              <span className='text-sm font-medium'>6</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total comments</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='relative'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500' />
              <input
                type='text'
                placeholder='Search items...'
                className='h-10 w-64 rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400'
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search items</p>
          </TooltipContent>
        </Tooltip>
        <Button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
          <SortAsc className='h-4 w-4' />
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
              <Filter className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter items</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                onClick={onOpenRadarChart}
                disabled={!isActiveRadarChart}
              >
                <BarChart3 className='h-4 w-4' />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>View performance chart</p>
          </TooltipContent>
        </Tooltip>
        {isOwner && (
          <>
            <InviteRetroDialog retroId={retroSession?._id} />
            <PollModal />
          </>
        )}
        <div className='mx-2 h-8 w-px bg-gray-300 dark:bg-gray-600' />

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                disabled
                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              >
                <Share className='h-4 w-4' />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share item</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                disabled={step !== 3}
                onClick={() => downloadRetroSession(retroId)}
                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              >
                {isDownloading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Download className='h-4 w-4' />
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download item</p>
          </TooltipContent>
        </Tooltip>

        <Drawer direction='right'>
          <DrawerTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
                  <SquarePen className='h-4 w-4' />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit retrospective</p>
              </TooltipContent>
            </Tooltip>
          </DrawerTrigger>
          <DrawerContent className='flex h-full flex-col'>
            <DrawerTitle>
              <div className='flex items-center justify-between border-b border-[#3c3c3c] p-4'>
                <div className='flex items-center space-x-2'>
                  <h3 className='text-xl font-semibold'>Action Items</h3>
                </div>
                <span className='text-sm text-gray-400'>
                  {retroSession?.actionItems?.length} Items
                </span>
              </div>
            </DrawerTitle>

            <DrawerActionItemContent retroId={retroId} />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

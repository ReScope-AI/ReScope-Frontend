'use client';
import { KanbanBoard } from './kanban-board';
import NewTaskDialog from './new-task-dialog';
import {
  MessageSquareMore,
  ThumbsUp,
  Filter,
  Search,
  SortAsc,
  RotateCcw,
  SquarePen,
  MessageCircle,
  CreditCard
} from 'lucide-react';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import PollModal from './polls';
import { Button } from '@/components/ui/button';

export default function KanbanViewPage() {
  return (
    <div className='flex h-full flex-col'>
      {/* Header Section */}
      <HeaderBar />

      <div className='flex-shrink-0'>
        <NewTaskDialog />
      </div>

      <div className='flex-1 overflow-hidden'>
        <KanbanBoard />
      </div>
    </div>
  );
}

export function HeaderBar() {
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

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  return (
    <div className='flex w-full items-center justify-between space-x-2 border-b bg-white px-4 pb-4 text-sm'>
      {/* Left section */}
      <div className='flex items-center gap-2'>
        <div className='relative'>
          <Avatar className='h-10 w-10 overflow-hidden rounded-full border'>
            <AvatarImage src='/avatars/01.png' alt='User' />
            <AvatarFallback className='bg-gray-200 text-xs'>KA</AvatarFallback>
          </Avatar>
          <div className='absolute -right-1 -bottom-1 h-5 w-5'>
            {/* <div className='flex h-4 w-4 items-center justify-center rounded-full shadow'>
              <MessageSquareMore className='h-3 w-3 text-gray-500' />
            </div> */}
          </div>
        </div>

        <button className='rounded-xl border px-6 py-1.5'>Ready 0/2</button>
      </div>

      {/* Right section */}
      <div className='flex items-center gap-2'>
        <ThumbsUp className='h-4 w-4 text-gray-600' />

        <MessageSquareMore className='h-4 w-4 text-gray-600' />

        <span className='text-gray-600'>6</span>

        <div className='relative'>
          <Search className='absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Search items...'
            className='rounded-md border py-2 pr-2 pl-8 text-sm focus:outline-none'
          />
        </div>

        <CreditCard className='h-6 w-auto text-gray-600' />
        <SortAsc className='h-6 w-auto text-gray-600' />
        <Filter className='h-6 w-auto text-gray-600' />

        <div className='mx-2 h-6 w-px bg-gray-300' />

        <RotateCcw className='h-6 w-auto text-gray-600' />
        <SquarePen className='h-6 w-auto text-gray-600' />
        <MessageCircle className='h-6 w-auto text-gray-600' />
      </div>
    </div>
  );
}

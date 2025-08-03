import {
  Clock,
  Edit3,
  Loader2,
  MoreVertical,
  Trash2,
  TrendingUp,
  User
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Import AlertDialog components for the confirmation dialog

import { IActionItem } from '@/types';

type ActionItemCardProps = {
  actionItem: IActionItem;
  handleDeleteActionItem: (actionItem: IActionItem) => void;
  isDeletingActionItem: boolean;
  isOpenEditDialog: boolean;
  setIsOpenEditDialog: (isOpen: boolean) => void;
};

const ActionItemCard = ({
  actionItem,
  handleDeleteActionItem,
  isDeletingActionItem,
  isOpenEditDialog,
  setIsOpenEditDialog
}: ActionItemCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-400';
      case 'in_progress':
        return 'text-blue-400';
      case 'completed':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  // Helper function to get priority color based on priority string
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className='relative mb-3 rounded-lg border p-4 transition-all'>
      {/* Left accent line */}
      <div className='bg-primary absolute top-0 left-0 h-full w-1 rounded-l-lg'></div>

      {/* Header */}
      <div className='mb-3 flex items-start justify-between'>
        <h3 className='pr-8 text-lg font-semibold'>{actionItem.title}</h3>

        <DropdownMenu>
          <DropdownMenuTrigger className='focus:outline-none'>
            <MoreVertical className='h-4 w-4 text-gray-500 transition-colors hover:text-gray-700' />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align='end'
            sideOffset={8}
            className='animate-in fade-in zoom-in-75 w-40 rounded-md border border-gray-200 bg-white p-1 shadow-xl'
          >
            <DropdownMenuItem
              disabled={isOpenEditDialog}
              className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-black'
            >
              <Edit3 className='h-3 w-3 text-blue-500' />
              <span>Edit</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={isDeletingActionItem}
              className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700'
              onSelect={(e) => {
                e.preventDefault();
                setIsOpenEditDialog(true);
              }}
            >
              {isDeletingActionItem ? (
                <Loader2 className='h-3 w-3 animate-spin' />
              ) : (
                <>
                  <Trash2 className='h-3 w-3 text-red-500' />
                  <span>Delete</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* The confirmation dialog component */}
      <Dialog>
        <AlertDialog open={isOpenEditDialog} onOpenChange={setIsOpenEditDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this action item?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                action item
                <span className='font-bold'>{actionItem.title}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingActionItem}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteActionItem(actionItem)}
                disabled={isDeletingActionItem}
                className='flex items-center gap-2'
              >
                {isDeletingActionItem && (
                  <Loader2 className='h-4 w-4 animate-spin' />
                )}
                {isDeletingActionItem ? 'Deleting...' : 'Confirm'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Dialog>

      {/* Description */}
      {actionItem.description && (
        <div className='mb-4 text-sm'>
          <p className='mb-1'>{actionItem.description}</p>
        </div>
      )}

      {/* Status indicators */}
      <div className='flex items-center justify-between text-xs text-gray-300'>
        <div className='flex items-center gap-1'>
          <User className='h-3 w-3' />
          <span>{actionItem.assignee_to || 'Not Assigned'}</span>
        </div>

        <div className='flex items-center gap-1'>
          <TrendingUp className='h-3 w-3' />
          {/* Note: I'm using a placeholder priority color here as the data isn't in your actionItem object */}
          <span className={getPriorityColor('medium')}>Medium</span>
        </div>

        <div className='flex items-center gap-1'>
          <Clock className='h-3 w-3' />
          <span className={`capitalize ${getStatusColor(actionItem.status)}`}>
            {actionItem.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActionItemCard;

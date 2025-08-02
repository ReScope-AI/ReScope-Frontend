'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconCheck,
  IconDots,
  IconEdit,
  IconEye,
  IconTrash,
  IconUsers
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';

import { showNotification } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  emitDeletePollQuestion,
  emitEditPollQuestion,
  emitVotePollQuestion
} from '@/lib/retro-socket';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { useUserStore } from '@/stores/userStore';

import { useTaskStore } from '../utils/store';

import { PollQuestionEditDialog } from './poll-question-edit-dialog';

import type { IOption, IQuestion } from '@/types/IRetroSession';

interface PollQuestionCardProps {
  question: IQuestion;
  disableDragExternal?: boolean;
}

export function PollQuestionCard({
  question,
  disableDragExternal = false
}: PollQuestionCardProps) {
  const retroId = useRetroSessionStore((state) => state.retroSession?._id);
  const user = useUserStore((state) => state.user);
  const step = useTaskStore((state) => state.step);

  // Dialog state management
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Drag and drop functionality setup
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: question._id,
    data: { type: 'PollQuestion', question },
    attributes: { roleDescription: 'Poll Question' },
    disabled: disableDragExternal
  });

  // Apply drag transform styles
  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  // Track which option the user has voted for
  const [votedOption, setVotedOption] = useState<string | null>(null);

  // Check which option user has voted for based on server data
  const getServerVotedOption = () => {
    for (const option of question.options) {
      if (option.votes.some((vote) => vote.created_by === user?._id)) {
        return option._id;
      }
    }
    return null;
  };

  // Sync local state with server data when question changes
  useEffect(() => {
    const serverVoted = getServerVotedOption();
    setVotedOption(serverVoted); // Server data always takes priority
  }, [question, user]);

  // Handle voting for an option
  const handleVote = (
    optionId: string,
    questionId: string,
    roomId: string | undefined
  ) => {
    if (!roomId || !user) return;

    // Update UI immediately for better UX
    setVotedOption(optionId);

    // Send vote to server
    emitVotePollQuestion({
      roomId,
      question_id: questionId,
      option_id: optionId
    });
  };

  // Handle editing poll question
  const handleEdit = (updated: IQuestion, roomId: string | undefined) => {
    if (!roomId) return;
    setEditOpen(false);
    emitEditPollQuestion({
      roomId,
      questionId: updated._id,
      text: updated.text,
      option: updated.options.map((option) => {
        if (option.notCreated) {
          return {
            optionId: null,
            text: option.text
          };
        }
        return {
          optionId: option._id,
          text: option.text
        };
      })
    });
  };

  const handleDelete = (questionId: string, roomId: string | undefined) => {
    if (!roomId) return;
    setDeleteOpen(false);
    emitDeletePollQuestion({
      roomId,
      id: questionId
    });
  };

  // Calculate total votes for progress visualization
  const totalVotes = question.options.reduce(
    (sum, option) => sum + option.votes.length,
    0
  );

  // Get current voted option (local or server)
  const currentVotedOption = votedOption;

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`group relative mb-4 overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-sm ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-lg hover:ring-gray-300/50 dark:from-gray-900 dark:to-gray-800/50 dark:ring-gray-700/50 dark:hover:ring-gray-600/50 ${isDragging ? 'scale-105 rotate-2 shadow-xl' : ''} `}
        {...attributes}
        {...listeners}
      >
        {/* Gradient overlay for visual appeal */}
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10' />

        <CardContent className='relative p-2'>
          {/* Header section with poll type and actions */}
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Badge
                variant='secondary'
                className='bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
              >
                <IconEye size={14} className='mr-1' />
                Public Poll
              </Badge>
              {totalVotes > 0 && (
                <Badge
                  variant='outline'
                  className='border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
                >
                  <IconUsers size={14} className='mr-1' />
                  {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                </Badge>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-8 w-8 cursor-pointer text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                >
                  <IconDots size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-48 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'
              >
                <DropdownMenuItem
                  onClick={() => {
                    if (step !== 1) {
                      showNotification(
                        'info',
                        'You can only edit poll in step Reflect'
                      );
                      return;
                    }
                    setEditOpen(true);
                  }}
                  className={`flex items-center gap-2 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 ${step !== 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <IconEdit size={16} />
                  Edit Poll
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (step !== 1) {
                      showNotification(
                        'info',
                        'You can only delete poll in step Reflect'
                      );
                      return;
                    }
                    setDeleteOpen(true);
                  }}
                  className={`flex items-center gap-2 text-red-600 hover:bg-red-50 focus:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 ${step !== 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <IconTrash size={16} />
                  Delete Poll
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Poll question text */}
          <div className='mb-6 text-lg leading-relaxed font-semibold text-gray-900 dark:text-gray-100'>
            {question.text}
          </div>

          {/* Poll options */}
          <div className='space-y-3'>
            {question.options.map((option: IOption) => {
              const optionVotes = option.votes.length;
              const percentage =
                totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
              const isSelected = currentVotedOption === option._id;

              return (
                <div key={option._id} className='relative'>
                  <Button
                    size='lg'
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => {
                      if (isSelected) return;
                      if (step !== 1) {
                        showNotification(
                          'info',
                          'You can only vote in step Reflect'
                        );
                        return;
                      }
                      handleVote(option._id, question._id, retroId);
                    }}
                    className={`relative h-auto min-h-[3rem] w-full cursor-pointer justify-between overflow-hidden px-4 py-3 text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700'
                        : 'cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700'
                    } ${step !== 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {/* Progress bar background for voted options */}
                    {totalVotes > 0 && (
                      <div
                        className={`absolute inset-0 transition-all duration-500 ease-out ${isSelected ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/30'} `}
                        style={{ width: `${percentage}%` }}
                      />
                    )}

                    {/* Option content with proper text wrapping */}
                    <div className='relative flex w-full items-start justify-between gap-3'>
                      <span className='flex-1 text-left leading-relaxed font-medium text-wrap'>
                        {option.text}
                      </span>
                      <div className='flex flex-shrink-0 items-center gap-1'>
                        {totalVotes > 0 && (
                          <span
                            className={`text-sm font-medium whitespace-nowrap ${
                              isSelected
                                ? 'text-white/90'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {optionVotes} ({Math.round(percentage)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      {retroId && (
        <PollQuestionEditDialog
          open={editOpen}
          question={question}
          onClose={() => setEditOpen(false)}
          onSave={(updated) => handleEdit(updated, retroId)}
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className='border-gray-200 bg-white sm:max-w-md dark:border-gray-700 dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='text-gray-900 dark:text-gray-100'>
              Delete Poll
            </DialogTitle>
          </DialogHeader>
          <div className='text-gray-600 dark:text-gray-400'>
            Are you sure you want to delete this poll? This action cannot be
            undone.
          </div>
          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setDeleteOpen(false)}
              className='border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                handleDelete(question._id, retroId);
              }}
              className='bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

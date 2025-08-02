'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconCheck,
  IconDots,
  IconEdit,
  IconEye,
  IconTrash
} from '@tabler/icons-react';
import { isEmpty } from 'lodash';
import { useState } from 'react';

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
import { emitEditPollQuestion, emitVotePollQuestion } from '@/lib/retro-socket';
import { usePollStore } from '@/stores/pollStore';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { useUserStore } from '@/stores/userStore';

import { PollQuestionEditDialog } from './poll-question-edit-dialog';

import type { IOption, IQuestion, IVote } from '@/types/IRetroSession';

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

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleVote = (
    optionId: string,
    questionId: string,
    roomId: string | undefined
  ) => {
    if (!roomId) return;
    emitVotePollQuestion({
      roomId,
      question_id: questionId,
      option_id: optionId
    });
    setVotedOption(optionId);
  };

  const handleEdit = (updated: IQuestion, roomId: string | undefined) => {
    if (!roomId) return;
    setEditOpen(false);

    // Emit socket event to update poll question
    emitEditPollQuestion({
      roomId,
      questionId: updated._id,
      text: updated.text,
      option: updated.options.map((option) => ({
        optionId: option._id,
        text: option.text
      }))
    });
    ``;
  };

  const checkIsVoted = (votes: IVote[]) => {
    if (isEmpty(votes)) return false;
    return votes.some((vote) => vote.created_by === user?._id);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className='mb-3 border border-gray-200 shadow-sm transition-shadow hover:shadow-md'
      >
        <CardContent className='px-4'>
          <div className='mb-3 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <IconEye size={16} className='text-gray-400' />
              <span className='text-sm text-gray-600'>Public Poll</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-8 w-8 text-gray-400 hover:text-gray-600'
                >
                  <IconDots size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem
                  onClick={() => setEditOpen(true)}
                  className='flex items-center gap-2'
                >
                  <IconEdit size={16} />
                  Edit Poll
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className='flex items-center gap-2 text-red-600 focus:text-red-600'
                >
                  <IconTrash size={16} />
                  Delete Poll
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='mb-4 text-base leading-relaxed font-medium text-gray-900'>
            {question.text}
          </div>
          <div className='space-y-2'>
            {question.options.map((option: IOption) => (
              <Button
                key={option._id}
                size='sm'
                variant={checkIsVoted(option.votes) ? 'outline' : 'default'}
                onClick={() => handleVote(option._id, question._id, retroId)}
                className={`h-10 w-full justify-start px-4 ${
                  checkIsVoted(option.votes)
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className='flex-1 text-left'>{option.text}</span>
                {checkIsVoted(option.votes) && (
                  <IconCheck size={16} className='ml-2' />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {retroId && (
        <PollQuestionEditDialog
          open={editOpen}
          question={question}
          onClose={() => setEditOpen(false)}
          onSave={(updated) => handleEdit(updated, retroId)}
        />
      )}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete Poll</DialogTitle>
          </DialogHeader>
          <div className='text-gray-600'>
            Are you sure you want to delete this poll? This action cannot be
            undone.
          </div>
          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                // setDeleteOpen(false);
                // onDelete?.(question._id);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

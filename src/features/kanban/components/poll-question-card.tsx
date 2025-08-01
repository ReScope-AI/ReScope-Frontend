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

import { PollQuestionEditDialog } from './poll-question-edit-dialog';

import type { IOption, IQuestion } from '@/types/IRetroSession';

interface PollQuestionCardProps {
  question: IQuestion;
  disableDragExternal?: boolean;
  onEdit?: (question: IQuestion) => void;
  onDelete?: (questionId: string) => void;
  onVote?: (optionId: string) => void;
}

export function PollQuestionCard({
  question,
  disableDragExternal = false,
  onEdit,
  onDelete,
  onVote
}: PollQuestionCardProps) {
  const { setNodeRef, transform, transition } = useSortable({
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

  const handleVote = (optionId: string) => {
    setVotedOption(optionId);
    onVote?.(optionId);
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
                variant={votedOption === option._id ? 'default' : 'outline'}
                onClick={() => handleVote(option._id)}
                disabled={!!votedOption}
                className={`h-10 w-full justify-start px-4 ${
                  votedOption === option._id
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className='flex-1 text-left'>{option.text}</span>
                {votedOption === option._id && (
                  <IconCheck size={16} className='ml-2' />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <PollQuestionEditDialog
        open={editOpen}
        question={question}
        onClose={() => setEditOpen(false)}
        onSave={(updated) => {
          setEditOpen(false);
          onEdit?.(updated);
        }}
      />

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
                setDeleteOpen(false);
                onDelete?.(question._id);
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

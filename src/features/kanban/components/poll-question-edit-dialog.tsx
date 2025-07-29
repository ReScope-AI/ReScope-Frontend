'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  IconGripVertical,
  IconTrash,
  IconX,
  IconPlus
} from '@tabler/icons-react';
import type { IQuestion, IOption } from '@/types/IRetroSession';
import { useEffect, useState } from 'react';

interface PollQuestionEditDialogProps {
  open: boolean;
  question: IQuestion | null;
  onClose: () => void;
  onSave: (updated: IQuestion) => void;
}

export function PollQuestionEditDialog({
  open,
  question,
  onClose,
  onSave
}: PollQuestionEditDialogProps) {
  const [text, setText] = useState(question?.text || '');
  const [options, setOptions] = useState<IOption[]>(question?.options || []);

  useEffect(() => {
    setText(question?.text || '');
    setOptions(question?.options || []);
  }, [question]);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((opts) =>
      opts.map((opt, i) => (i === idx ? { ...opt, text: value } : opt))
    );
  };

  const handleAddOption = () => {
    setOptions((opts) => [
      ...opts,
      {
        _id: Math.random().toString(),
        text: '',
        order: opts.length,
        question_id: question?._id || '',
        created_at: '',
        updated_at: ''
      }
    ]);
  };

  const handleRemoveOption = (idx: number) => {
    setOptions((opts) => opts.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!text.trim() || options.some((o) => !o.text.trim())) return;
    onSave({ ...question!, text, options });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <DialogTitle className='text-xl font-semibold text-gray-900'>
            Edit Poll
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Question Section */}
          <div className='space-y-2'>
            <Label
              htmlFor='question'
              className='text-sm font-medium tracking-wide text-gray-700 uppercase'
            >
              Question
            </Label>
            <Input
              id='question'
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Question'
              className='h-11 text-base'
            />
          </div>

          {/* Options Section */}
          <div className='space-y-3'>
            <Label className='text-sm font-medium tracking-wide text-gray-700 uppercase'>
              Options
            </Label>
            <div className='space-y-2'>
              {options.map((opt, idx) => (
                <div key={opt._id} className='group flex items-center gap-2'>
                  <div className='flex h-6 w-6 items-center justify-center text-gray-400'>
                    <IconGripVertical size={16} />
                  </div>
                  <Input
                    value={opt.text}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className='h-11 flex-1'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveOption(idx)}
                    disabled={options.length <= 2}
                    className='h-8 w-8 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600'
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type='button'
              onClick={handleAddOption}
              variant='ghost'
              className='h-10 w-full border-2 border-dashed border-gray-200 text-purple-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700'
            >
              <IconPlus size={16} className='mr-2' />
              ADD OPTION
            </Button>
          </div>
        </div>

        <DialogFooter className='gap-2 pt-6'>
          <Button
            variant='outline'
            onClick={onClose}
            className='h-11 flex-1 bg-transparent'
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSave}
            disabled={!text.trim() || options.some((o) => !o.text.trim())}
            className='h-11 flex-1 bg-purple-600 hover:bg-purple-700'
          >
            SAVE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

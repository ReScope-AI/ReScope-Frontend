'use client';

import {
  Loader2,
  Share2,
  UserRoundPlus,
  CheckCircle,
  Users
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useInviteToRetro } from '@/hooks/use-retro-session-api';

import { showNotification } from '../common';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputLabel,
  TagsInputList
} from '../ui/tags-input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip';

interface InviteRetroDialogProps {
  retroId?: string;
}

export function InviteRetroDialog({ retroId }: InviteRetroDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const inviteToRetroMutation = useInviteToRetro();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emails.length === 0 || !retroId) return;

    inviteToRetroMutation.mutate(
      {
        session_id: retroId,
        email: emails
      },
      {
        onSuccess: () => {
          setInviteSuccess(true);
          setEmails([]);
          setTimeout(() => {
            setInviteSuccess(false);
            setIsOpen(false);
          }, 2000);
        }
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEmails([]);
      setInviteSuccess(false);
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className='group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-purple-300 hover:from-purple-50 hover:to-slate-100 hover:text-purple-600 hover:shadow-xl dark:border-slate-700/60 dark:from-slate-800 dark:to-slate-900 dark:text-slate-400 dark:hover:border-purple-600 dark:hover:from-purple-900/20 dark:hover:to-slate-800 dark:hover:text-purple-400'
              >
                <UserRoundPlus className='h-5 w-5 transition-transform duration-300 group-hover:rotate-12' />
                <div className='absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20' />
              </Button>
            </TooltipTrigger>

            <TooltipContent
              side='top'
              className='bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
            >
              <p className='font-medium'>Invite to Retro</p>
              <p className='text-xs opacity-80'>
                Share this retro session with your team
              </p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>

        <DialogContent className='flex max-w-lg flex-col overflow-hidden border-0 bg-white p-0 shadow-2xl dark:bg-slate-900'>
          {/* Header with gradient background */}
          <div className='relative flex-shrink-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-8'>
            <div className='absolute inset-0 bg-black/10' />
            <div className='relative'>
              <DialogHeader className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
                      <UserRoundPlus className='h-6 w-6 text-white' />
                    </div>
                    <div>
                      <DialogTitle className='text-2xl font-bold text-white'>
                        Invite to Retro
                      </DialogTitle>
                      <DialogDescription className='text-blue-100'>
                        Share this retro session with your team
                      </DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>
            </div>
            {/* Decorative elements */}
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl' />
            <div className='absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl' />
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto'>
            <div className='space-y-6 px-6 py-6'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Email Section */}
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-blue-500' />
                    <label className='text-sm font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300'>
                      Email Addresses
                    </label>
                    {emails.length > 0 && (
                      <div className='flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 dark:bg-blue-900/50'>
                        <Users className='h-3 w-3 text-blue-600 dark:text-blue-400' />
                        <span className='text-xs font-medium text-blue-600 dark:text-blue-400'>
                          {emails.length}{' '}
                          {emails.length === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                    )}
                  </div>
                  <TagsInput
                    className='w-full'
                    value={emails}
                    onValueChange={setEmails}
                    onValidate={(value) => value.length > 2}
                    onInvalid={(value) =>
                      emails.includes(value)
                        ? showNotification('warning', 'Email already exists')
                        : showNotification(
                            'warning',
                            `${value} is not a valid email`
                          )
                    }
                    editable
                    addOnPaste
                  >
                    <TagsInputList>
                      {emails.map((email) => (
                        <TagsInputItem key={email} value={email}>
                          {email}
                        </TagsInputItem>
                      ))}
                      <TagsInputInput placeholder='Add email...' />
                    </TagsInputList>
                    <div className='text-muted-foreground text-sm'>
                      Press Enter, comma, or space to add emails. You can also
                      paste multiple emails.
                    </div>
                  </TagsInput>
                </div>

                {/* Success Message */}
                {inviteSuccess && (
                  <div className='rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-800/50'>
                        <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
                      </div>
                      <div>
                        <p className='font-medium text-green-800 dark:text-green-200'>
                          {emails.length > 0
                            ? `${emails.length} invitations sent successfully!`
                            : 'Invitation sent successfully!'}
                        </p>
                        <p className='text-sm text-green-600 dark:text-green-300'>
                          {emails.length > 0
                            ? 'Your colleagues will'
                            : 'Your colleague will'}{' '}
                          receive the invitation shortly
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className='flex-shrink-0 border-t border-slate-200 bg-slate-50/50 px-6 py-6 dark:border-slate-700 dark:bg-slate-800/50'>
            <div className='flex gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsOpen(false)}
                className='group relative h-12 flex-1 cursor-pointer border-slate-200/60 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-slate-300 hover:from-slate-100 hover:to-slate-200 hover:text-slate-700 hover:shadow-xl dark:border-slate-700/60 dark:from-slate-800 dark:to-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:from-slate-700 dark:hover:to-slate-800 dark:hover:text-slate-300'
              >
                <span className='transition-transform duration-300 group-hover:scale-105'>
                  Cancel
                </span>
                <div className='absolute -inset-1 rounded-xl bg-gradient-to-r from-slate-400 to-slate-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-10' />
              </Button>
              <Button
                type='submit'
                onClick={handleSubmit}
                disabled={
                  inviteToRetroMutation.isPending ||
                  emails.length === 0 ||
                  inviteSuccess
                }
                className='group relative h-12 flex-1 cursor-pointer border-purple-200/60 bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-purple-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
              >
                {inviteToRetroMutation.isPending ? (
                  <div className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin transition-transform duration-300' />
                    <span className='transition-transform duration-300'>
                      Sending...
                    </span>
                  </div>
                ) : inviteSuccess ? (
                  <div className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 transition-transform duration-300 group-hover:rotate-12' />
                    <span className='transition-transform duration-300 group-hover:scale-105'>
                      Sent!
                    </span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Share2 className='h-4 w-4 transition-transform duration-300 group-hover:rotate-12' />
                    <span className='transition-transform duration-300 group-hover:scale-105'>
                      Send{' '}
                      {emails.length > 1
                        ? `${emails.length} Invitations`
                        : 'Invitation'}
                    </span>
                  </div>
                )}
                <div className='absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20' />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

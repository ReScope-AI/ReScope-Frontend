'use client';

import { Loader2, Share2 } from 'lucide-react';
import * as React from 'react';

import { useDialog } from '@/components/contexts/dialog-context';
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useInviteToRetro } from '@/hooks/use-retro-session-api';

export function useShareRetroDialog() {
  const { showDialog } = useDialog();

  const openShareDialog = (retroId: string) => {
    showDialog({
      title: 'Share Retro Session',
      content: <ShareRetroContent retroId={retroId} />,
      slotProps: {
        dialogContent: {
          className: 'sm:max-w-md'
        },
        dialogHeader: {
          children: (
            <>
              <DialogDescription>
                Enter an email address to share this retro session link
              </DialogDescription>
            </>
          )
        }
      }
    });
  };

  return { openShareDialog };
}

function ShareRetroContent({ retroId }: { retroId: string }) {
  const [email, setEmail] = React.useState('');
  const [shareSuccess, setShareSuccess] = React.useState(false);
  const { closeDialog } = useDialog();

  const inviteToRetroMutation = useInviteToRetro();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    inviteToRetroMutation.mutate(
      {
        session_id: retroId,
        email: [email]
      },
      {
        onSuccess: () => {
          setShareSuccess(true);
          setEmail('');
          setTimeout(() => {
            setShareSuccess(false);
            closeDialog();
          }, 2000);
        }
      }
    );
  };

  return (
    <div className='space-y-4 py-2'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='email' className='text-sm font-medium'>
            Email
          </label>
          <Input
            id='email'
            type='email'
            placeholder='name@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full'
          />
        </div>

        <div className='pt-2'>
          <Button
            type='submit'
            disabled={inviteToRetroMutation.isPending || !email}
            className='w-full'
          >
            {inviteToRetroMutation.isPending ? (
              <span className='flex items-center justify-center'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Sending...
              </span>
            ) : (
              <>
                <Share2 className='mr-2 h-4 w-4' />
                Share
              </>
            )}
          </Button>
        </div>

        {shareSuccess && (
          <div className='text-center text-sm text-green-600 dark:text-green-400'>
            Retro session link shared successfully!
          </div>
        )}
      </form>
    </div>
  );
}

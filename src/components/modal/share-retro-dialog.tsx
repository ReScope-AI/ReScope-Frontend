import { Loader2, Share2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useInviteToRetro } from '@/hooks/use-retro-session-api';

interface ShareRetroDialogProps {
  retroId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareRetroDialog({
  retroId,
  isOpen,
  onClose
}: ShareRetroDialogProps) {
  const [email, setEmail] = React.useState('');
  const [shareSuccess, setShareSuccess] = React.useState(false);

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
            onClose();
          }, 2000);
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Share Retro Session</DialogTitle>
          <DialogDescription>
            Enter an email address to share this retro session link
          </DialogDescription>
        </DialogHeader>

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

            <DialogFooter className='pt-2'>
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
            </DialogFooter>

            {shareSuccess && (
              <div className='text-center text-sm text-green-600 dark:text-green-400'>
                Retro session link shared successfully!
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

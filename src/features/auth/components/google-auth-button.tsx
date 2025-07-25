import { LoadingIndicator } from '@/components/common';
import { Button } from '@/components/ui/button';
import { auth, googleProvider } from '@/config/firebase';
import { useLogin } from '@/hooks/use-auth';
import { signInWithPopup } from 'firebase/auth';
import { useState } from 'react';

export default function GoogleSignInButton() {
  const loginMutation = useLogin();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    if (isLoading) return;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        const googleId = user.uid;
        const email = user.email || '';
        const name = user.displayName || '';
        const avatar = user.photoURL || '';
        setIsLoading(true);
        await loginMutation.mutateAsync({ googleId, email, name, avatar });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error during sign-in: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant='outline'
      className='h-11 w-full cursor-pointer border-gray-300 bg-transparent text-gray-700 transition-colors hover:bg-gray-50 sm:h-12 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-700'
      onClick={() => signInWithGoogle()}
    >
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <svg className='mr-2 h-4 w-4 sm:mr-3 sm:h-5 sm:w-5' viewBox='0 0 24 24'>
          <path
            fill='#4285F4'
            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
          />
          <path
            fill='#34A853'
            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
          />
          <path
            fill='#FBBC05'
            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
          />
          <path
            fill='#EA4335'
            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
          />
        </svg>
      )}
      <span className='text-sm sm:text-base'>Continue with Google</span>
    </Button>
  );
}

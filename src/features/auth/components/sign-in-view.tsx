'use client';

import dynamic from 'next/dynamic';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from '@public/assets/logo.png';
import Image from 'next/image';
import Link from 'next/link';

const GoogleSignInButton = dynamic(() => import('./google-auth-button'), {
  ssr: false
});

export default function SignInViewPage() {
  return (
    <div className='relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Login
      </Link>

      {/* Left Panel - Hero Section */}
      <div className='relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        {/* Background image */}
        <Image
          src={require('@public/assets/background-1.jpg')}
          alt='Background'
          fill
          className='absolute inset-0 z-0 object-cover'
          priority
        />
        {/* Overlay gradients for effect */}
        <div className='absolute inset-0 z-10 bg-gradient-to-br from-black via-gray-900 to-gray-800 opacity-70' />
        <div className='absolute inset-0 z-10 bg-black/20' />

        {/* Animated background elements */}
        <div className='absolute inset-0 z-10 overflow-hidden'>
          <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl'></div>
          <div className='bg-black-500/20 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl'></div>
          <div className='absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-2xl'></div>
        </div>

        <div className='relative z-20 flex items-center text-lg font-medium'>
          <div className='flex items-center space-x-2'>
            <div className='flex h-full w-full items-center justify-center rounded-2xl bg-white'>
              <Image src={logo} alt='logo' className='h-12 w-12 rounded-sm' />
            </div>
            <span className='text-xl font-bold'>ReScope</span>
          </div>
        </div>

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='h-px w-8 bg-white/30'></div>
              <span className='text-sm font-medium text-white/70'>
                INTRODUCTION
              </span>
            </div>
            <p className='text-xl leading-relaxed font-medium'>
              &ldquo;Unleash your team&apos;s full potential. Our tools and
              insights forge stronger processes, elevate collaboration, and
              build an unshakeable foundation for success.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <main className='flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
        <div className='w-full max-w-md'>
          <div className='hover:shadow-3xl relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 dark:bg-gray-900/80 dark:shadow-gray-900/30'>
            {/* Decorative elements */}
            <div className='from-black-500/20 to-black-500/20 absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br blur-xl'></div>
            <div className='from-black-500/20 to-black-500/20 absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gradient-to-tr blur-lg'></div>

            {/* Logo and Title */}
            <div className='relative mb-8 text-center'>
              <div className='mb-6 flex items-center justify-center space-x-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl p-0.5 shadow'>
                  <div className='flex h-full w-full items-center justify-center rounded-2xl bg-white'>
                    <Image
                      src={logo}
                      alt='logo'
                      className='h-12 w-12 rounded-sm'
                    />
                  </div>
                </div>
                <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-gray-300'>
                  ReScope
                </span>
              </div>
              <h1 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
                Welcome back
              </h1>
              <p className='text-gray-600 dark:text-gray-400'>
                Sign in to your account to continue
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className='mb-8'>
              <GoogleSignInButton />
            </div>

            {/* Divider */}
            <div className='relative mb-8'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300 dark:border-gray-600'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400'>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email Sign In Option */}
            <div className='mb-6'>
              <button className='w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
                Continue with Email
              </button>
            </div>

            {/* Terms and Privacy */}
            <div className='text-center'>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                By clicking continue, you agree to our{' '}
                <Link
                  href='/terms'
                  className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            {/* Sign Up Link */}
            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Don&apos;t have an account?{' '}
                <Link
                  href='/auth/sign-up'
                  className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

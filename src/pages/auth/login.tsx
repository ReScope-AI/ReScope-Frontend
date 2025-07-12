import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Rocket } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import Layout from './layout';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/utils/config/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed in: ', result.user);
    } catch (err) {
      console.error('Error during sign-in: ', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  return (
    <Layout>
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 sm:p-8 transition-colors duration-200">
            {/* Logo and Title */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-9 h-9 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">
                    <img src={logo} alt="logo" className="w-full h-full rounded-sm" />
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  ReScope
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Collaborate with your team
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="cursor-pointer w-full h-11 sm:h-12 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent dark:bg-transparent transition-colors"
                onClick={signInWithGoogle}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm sm:text-base">Continue with Google</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  or
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 sm:h-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                required
              />
              <Button
                type="submit"
                className="cursor-pointer w-full h-11 sm:h-12 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium transition-colors"
              >
                <span className="text-sm sm:text-base">Send Code</span>
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}

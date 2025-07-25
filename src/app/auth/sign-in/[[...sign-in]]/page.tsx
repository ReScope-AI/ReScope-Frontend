import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const SignInViewPage = dynamic(
  () => import('@/features/auth/components/sign-in-view')
);

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.'
};

export default async function Page() {
  return <SignInViewPage />;
}

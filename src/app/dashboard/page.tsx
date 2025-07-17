'use client';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();
  router.push('/dashboard/overview');
  return null;
};

export default DashboardPage;

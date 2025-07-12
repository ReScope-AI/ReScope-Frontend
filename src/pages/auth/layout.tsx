import Footer from '@/components/common/footer/footer';
import Header from '@/components/common/header/header';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;

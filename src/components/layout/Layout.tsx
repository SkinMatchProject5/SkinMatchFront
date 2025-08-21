import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-glass">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
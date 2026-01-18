'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function MainLayout({
  children,
  showSidebar = true
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-uh-bright">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

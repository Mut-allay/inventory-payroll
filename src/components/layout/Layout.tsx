import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar collapsed={collapsed} />

      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        
        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

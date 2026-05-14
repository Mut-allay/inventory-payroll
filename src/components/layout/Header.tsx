import React from 'react';
import { ChevronLeft, ChevronRight, Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Header = ({ collapsed, onToggle }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div className="hidden md:flex items-center relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search dashboard..." 
            className="pl-10 h-9 bg-slate-50 dark:bg-slate-950 border-none focus-visible:ring-1 focus-visible:ring-primary" 
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-slate-500 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </Button>
        <div className="h-8 w-px bg-slate-200 dark:border-slate-800 mx-2"></div>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="w-5 h-5" />
          </div>
        </Button>
      </div>
    </header>
  );
};

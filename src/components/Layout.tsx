import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Inbox as InboxIcon, 
  Calendar as CalendarIcon, 
  BookOpen, 
  ClipboardList, 
  FileText, 
  Settings,
  Plus,
  Search,
  Bell,
  User
} from 'lucide-react';
import { cn } from '../utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg",
        active 
          ? "bg-blue-600 text-white" 
          : "text-zinc-500 hover:text-blue-600 hover:bg-blue-50"
      )}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab 
}: { 
  children: React.ReactNode; 
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col p-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="font-bold text-lg tracking-tight text-blue-600">SAS Dashboard</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={InboxIcon} 
            label="Inbox" 
            active={activeTab === 'inbox'} 
            onClick={() => setActiveTab('inbox')} 
          />
          <SidebarItem 
            icon={CalendarIcon} 
            label="Calendar" 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
          />
          <SidebarItem 
            icon={BookOpen} 
            label="Modules" 
            active={activeTab === 'modules'} 
            onClick={() => setActiveTab('modules')} 
          />
          <SidebarItem 
            icon={ClipboardList} 
            label="Assignments" 
            active={activeTab === 'assignments'} 
            onClick={() => setActiveTab('assignments')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Notes" 
            active={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')} 
          />
        </nav>

        <div className="pt-4 border-t border-zinc-100">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-bottom border-zinc-200 bg-white flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks, modules, notes..." 
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
              <Bell size={20} />
            </button>
            <div className="h-8 w-[1px] bg-zinc-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">Student User</p>
                <p className="text-xs text-zinc-500">ynrdevs@gmail.com</p>
              </div>
              <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-zinc-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 pb-32">
          {children}
        </div>
      </main>
    </div>
  );
}

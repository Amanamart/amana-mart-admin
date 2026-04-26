'use client';

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Sun,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const notifications = [
  { id: 1, title: 'New order received', body: 'Order #AM-10234 has been placed', time: '2 min ago', read: false },
  { id: 2, title: 'Store approved', body: 'Dhaka Fresh Market has been approved', time: '1 hr ago', read: false },
  { id: 3, title: 'Withdrawal request', body: 'Store payout request for ৳12,500', time: '3 hr ago', read: true },
];

import { useTranslation } from '@/context/LanguageContext';

export interface TopbarProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Topbar({ onToggleSidebar, sidebarCollapsed }: TopbarProps) {
  const { lang, setLang } = useTranslation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="flex items-center h-[var(--topbar-height)] px-4 bg-[var(--topbar-background)] border-b border-[var(--topbar-border)] z-30 sticky top-0"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      {/* Left — sidebar toggle */}
      <button
        id="sidebar-toggle"
        onClick={onToggleSidebar}
        className="w-9 h-9 flex items-center justify-center rounded-[var(--radius)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors mr-3 shrink-0"
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:flex relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <input
          id="topbar-search"
          type="search"
          placeholder="Search orders, products, stores..."
          className="w-full h-9 pl-9 pr-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-1 focus:ring-[var(--primary)]/20 transition-all"
        />
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Language */}
        <button 
          onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
          className="px-2 h-9 flex items-center gap-2 rounded-[var(--radius)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors text-[11px] font-bold" 
          aria-label="Language"
        >
          <Globe className="w-4.5 h-4.5" />
          {lang === 'en' ? 'EN' : 'বাংলা'}
        </button>

        {/* Theme */}
        <button className="w-9 h-9 flex items-center justify-center rounded-[var(--radius)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors" aria-label="Toggle theme">
          <Sun className="w-4.5 h-4.5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="topbar-notifications"
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-[var(--radius)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-11 z-50 w-80 bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-lg)] overflow-hidden animate-slide-in-up">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-[13px] font-semibold text-[var(--foreground)]">Notifications</p>
                  <button className="text-[12px] text-[var(--primary)] font-medium hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-[var(--border)] max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-3 hover:bg-[var(--muted)] transition-colors cursor-pointer',
                        !n.read && 'bg-[var(--primary-light)]'
                      )}
                    >
                      <p className="text-[13px] font-medium text-[var(--foreground)]">{n.title}</p>
                      <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5">{n.body}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-[var(--border)] text-center">
                  <button className="text-[12px] text-[var(--primary)] font-medium hover:underline">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User */}
        <div className="relative ml-1">
          <button
            id="topbar-user"
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-[var(--radius-full)] hover:bg-[var(--muted)] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-semibold">
              AD
            </div>
            <span className="text-[13px] font-medium text-[var(--foreground)] hidden md:block">Admin</span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)] hidden md:block" />
          </button>

          {userOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
              <div className="absolute right-0 top-11 z-50 w-48 bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-lg)] overflow-hidden animate-slide-in-up">
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-[13px] font-semibold text-[var(--foreground)]">Admin</p>
                  <p className="text-[12px] text-[var(--muted-foreground)]">admin@amanamart.com</p>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                    <User className="w-4 h-4 text-[var(--muted-foreground)]" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                    <Settings className="w-4 h-4 text-[var(--muted-foreground)]" />
                    Settings
                  </button>
                  <div className="border-t border-[var(--border)] my-1" />
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

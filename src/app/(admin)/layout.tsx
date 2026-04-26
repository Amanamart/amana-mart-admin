'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--page-background)]">
      {/* Sidebar */}
      <div
        className={cn(
          'shrink-0 h-full transition-all duration-300 hidden lg:block',
          collapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]'
        )}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onToggleSidebar={() => setCollapsed(!collapsed)} sidebarCollapsed={collapsed} />
        <main className="flex-1 overflow-y-auto p-5 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

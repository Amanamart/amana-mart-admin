'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, Phone, Clock, User, 
  ExternalLink, ShoppingCart, Activity,
  ChevronRight, Filter, Search, Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { useWhatsAppSessions } from '@/hooks/useWhatsApp';

export function WhatsAppClient() {
  const [search, setSearch] = useState('');
  const { data: sessions, isLoading } = useWhatsAppSessions();

  const filteredSessions = sessions?.filter((s: any) => 
    s.phone.includes(search) || 
    (s.customer?.name && s.customer.name.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <PageHeader
        title="WhatsApp Ordering"
        subtitle="Monitor and manage automated ordering via WhatsApp"
        actions={
          <div className="flex bg-white border border-[var(--border)] rounded-[var(--radius)] p-1">
             <div className="px-3 py-1.5 text-[12px] font-bold text-green-600 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                WEBHOOK ACTIVE
             </div>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[12px] text-[var(--muted-foreground)]">Total Sessions</p>
            <p className="text-xl font-bold">{sessions?.length || 0}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[12px] text-[var(--muted-foreground)]">Orders via WA</p>
            <p className="text-xl font-bold">42</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[12px] text-[var(--muted-foreground)]">Active Funnels</p>
            <p className="text-xl font-bold">12</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-[var(--radius-lg)] border border-[var(--border)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search by phone or customer name..."
            className="w-full h-10 pl-10 pr-4 rounded-[var(--radius)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
      </div>

      {/* Sessions Table */}
      <Card padding="none" className="overflow-hidden border border-[var(--border)]">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-slate-50 border-b border-[var(--border)]">
            <tr>
              <th className="px-5 py-3 font-semibold text-[11px] text-[var(--muted-foreground)] uppercase">Customer / Phone</th>
              <th className="px-5 py-3 font-semibold text-[11px] text-[var(--muted-foreground)] uppercase">Current State</th>
              <th className="px-5 py-3 font-semibold text-[11px] text-[var(--muted-foreground)] uppercase">Activity</th>
              <th className="px-5 py-3 font-semibold text-[11px] text-[var(--muted-foreground)] uppercase text-center">Messages</th>
              <th className="px-5 py-3 font-semibold text-[11px] text-[var(--muted-foreground)] uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)] opacity-40" />
                  <p className="mt-2 text-[var(--muted-foreground)]">Fetching WhatsApp sessions...</p>
                </td>
              </tr>
            ) : filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-[var(--muted-foreground)]">
                  No WhatsApp sessions found.
                </td>
              </tr>
            ) : filteredSessions.map((session: any) => (
              <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{session.customer?.name || 'Guest Customer'}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {session.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      session.state === 'idle' ? 'bg-slate-100 text-slate-600' :
                      session.state === 'ordering' ? 'bg-blue-100 text-blue-600' :
                      session.state === 'confirm' ? 'bg-amber-100 text-amber-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {session.state}
                    </span>
                    <p className="text-[10px] text-[var(--muted-foreground)]">Active Funnel</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <Activity className="w-3.5 h-3.5 text-green-500" />
                    <span>{new Date(session.lastActivity).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                    {session._count?.messages || 0}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-[var(--primary)]">
                       <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                       <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Send, Bell, Users, Megaphone, Smartphone } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Tabs } from '@/components/ui/Tabs';
import { formatDate } from '@/lib/utils';

const RECENT_NOTIFICATIONS = [
  { id: '1', title: 'Eid Special Offer is Live!', body: 'Get up to 70% off on all categories. Limited time only!', audience: 'All Customers', sent: 38420, status: 'sent', date: '2026-04-20', type: 'promotion' },
  { id: '2', title: 'Your Order Has Been Delivered', body: 'Order #AM-10234 has been delivered to your address.', audience: 'Specific Customers', sent: 1, status: 'sent', date: '2026-04-20', type: 'order' },
  { id: '3', title: 'Flash Sale Starts in 1 Hour!', body: 'Hurry! Our biggest flash sale starts at 12:00 PM.', audience: 'App Users', sent: 12400, status: 'sent', date: '2026-04-19', type: 'promotion' },
  { id: '4', title: 'New Stores in Your Area', body: '5 new stores have joined your zone. Explore now!', audience: 'Dhaka North Users', sent: 8900, status: 'failed', date: '2026-04-19', type: 'zone' },
  { id: '5', title: 'Ramadan Offer Preview', body: 'Exclusive Ramadan deals dropping soon. Stay tuned!', audience: 'All Customers', sent: 0, status: 'scheduled', date: '2026-05-01', type: 'promotion' },
];

const TABS = [{ id: 'compose', label: 'Send Notification' }, { id: 'history', label: 'History' }];

export function NotificationsClient() {
  const [activeTab, setActiveTab] = useState('compose');
  const [audience, setAudience] = useState('');

  const typeColor: Record<string, string> = { promotion: '#1aab50', order: '#3b82f6', zone: '#f59e0b', system: '#6b7280' };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Push Notifications"
        subtitle="Send push notifications to customers, vendors, or riders"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Push Notifications' }]}
      />
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] px-4 pt-4 pb-0">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'compose' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-5 space-y-4">
            <Input label="Notification Title" required placeholder="e.g., Eid Special Offer!" />
            <Textarea label="Message Body" required placeholder="Write your notification message here..." rows={3} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Target Audience" required
                options={[
                  { value: 'all', label: 'All Customers' },
                  { value: 'zone', label: 'Zone-specific' },
                  { value: 'vendors', label: 'Vendors/Stores' },
                  { value: 'riders', label: 'Delivery Men' },
                  { value: 'specific', label: 'Specific Users' },
                ]}
                onChange={(e) => setAudience(e.target.value)}
              />
              <Select label="Module Filter" options={[
                { value: '', label: 'All Modules' },
                { value: 'grocery', label: 'Grocery' },
                { value: 'pharmacy', label: 'Pharmacy' },
                { value: 'ecommerce', label: 'eCommerce' },
                { value: 'food', label: 'Food' },
              ]} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Image URL (optional)" placeholder="https://..." />
              <Input label="Schedule For (optional)" type="datetime-local" />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline">Preview</Button>
              <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}>Send Notification</Button>
            </div>
          </div>

          {/* Phone Preview */}
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-5 flex flex-col items-center">
            <p className="text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-4">Preview</p>
            <div className="w-56 bg-[#1a1a2e] rounded-3xl p-3 shadow-xl">
              <div className="bg-[#2a2a3e] rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold">AM</div>
                  <div>
                    <p className="text-[10px] text-white font-semibold">Amana Mart</p>
                    <p className="text-[9px] text-gray-400">now</p>
                  </div>
                </div>
                <p className="text-[11px] text-white font-semibold mb-1">Eid Special Offer!</p>
                <p className="text-[10px] text-gray-300">Get up to 70% off on all categories. Limited time only!</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Audience: <strong>{audience || 'All Customers'}</strong>
              </p>
              <div className="flex items-center gap-1 justify-center mt-2 text-[11px] text-[var(--muted-foreground)]">
                <Smartphone className="w-3 h-3" /> Android + iOS
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8f9fb] border-b border-[var(--border)]">
                {['Title', 'Audience', 'Sent', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {RECENT_NOTIFICATIONS.map(n => (
                <tr key={n.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-[var(--radius)] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${typeColor[n.type]}15` }}>
                        <Bell className="w-4 h-4" style={{ color: typeColor[n.type] }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium">{n.title}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)] truncate max-w-xs">{n.body}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[12px]"><Users className="w-3 h-3 text-[var(--muted-foreground)]" />{n.audience}</div>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold">
                    {n.sent > 0 ? <span className="flex items-center gap-1"><Megaphone className="w-3 h-3 text-[var(--muted-foreground)]" />{n.sent.toLocaleString()}</span> : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={n.status === 'sent' ? 'success' : n.status === 'scheduled' ? 'info' : 'danger'} dot>
                      {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--muted-foreground)]">{formatDate(n.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

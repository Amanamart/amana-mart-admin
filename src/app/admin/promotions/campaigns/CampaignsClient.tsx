'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Target, Users, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Campaign {
  id: string;
  title: string;
  type: 'basic' | 'item';
  discount: number;
  target: string;
  budget: number;
  spent: number;
  reach: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'ended' | 'paused';
}

const CAMPAIGNS: Campaign[] = [
  { id: '1', title: 'Eid Special Grocery Deals', type: 'item', discount: 30, target: 'All Customers', budget: 50000, spent: 32000, reach: 12400, startDate: '2026-04-01', endDate: '2026-04-30', status: 'active' },
  { id: '2', title: 'New User Welcome Campaign', type: 'basic', discount: 25, target: 'New Users', budget: 20000, spent: 8500, reach: 3200, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active' },
  { id: '3', title: 'Summer Electronics Promo', type: 'item', discount: 20, target: 'Returning Customers', budget: 35000, spent: 35000, reach: 8900, startDate: '2026-03-15', endDate: '2026-03-31', status: 'ended' },
  { id: '4', title: 'Ramadan Night Deals', type: 'basic', discount: 40, target: 'All Customers', budget: 60000, spent: 0, reach: 0, startDate: '2026-05-01', endDate: '2026-05-31', status: 'scheduled' },
  { id: '5', title: 'Pharmacy Loyalty Boost', type: 'item', discount: 15, target: 'Loyal Customers', budget: 15000, spent: 7200, reach: 2100, startDate: '2026-04-10', endDate: '2026-04-25', status: 'paused' },
];

const TABS = [
  { id: 'all', label: 'All', count: CAMPAIGNS.length },
  { id: 'active', label: 'Active', count: CAMPAIGNS.filter(c => c.status === 'active').length },
  { id: 'scheduled', label: 'Scheduled', count: CAMPAIGNS.filter(c => c.status === 'scheduled').length },
  { id: 'ended', label: 'Ended', count: CAMPAIGNS.filter(c => c.status === 'ended').length },
];

export function CampaignsClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = CAMPAIGNS.filter(c => activeTab === 'all' || c.status === activeTab);

  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    scheduled: { variant: 'info' as const, label: 'Scheduled' },
    ended: { variant: 'muted' as const, label: 'Ended' },
    paused: { variant: 'warning' as const, label: 'Paused' },
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Campaigns"
        subtitle="Manage promotional campaigns and marketing initiatives"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Promotions' }, { label: 'Campaigns' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Create Campaign
          </Button>
        }
      />

      {/* Tabs */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] px-4 pt-4 pb-0">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Campaign Cards */}
      <div className="space-y-3">
        {filtered.map((campaign) => {
          const cfg = statusConfig[campaign.status];
          const progress = campaign.budget > 0 ? Math.round((campaign.spent / campaign.budget) * 100) : 0;
          return (
            <div key={campaign.id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-5 hover:shadow-[var(--shadow-md)] transition-all">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--primary-light)] flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[var(--foreground)]">{campaign.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="info">{campaign.type === 'basic' ? 'Basic Campaign' : 'Item Campaign'}</Badge>
                      <span className="text-[11px] text-[var(--muted-foreground)]">{campaign.discount}% off · {campaign.target}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
                  <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-amber-50 hover:text-amber-600 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {[
                  { label: 'Budget', value: formatCurrency(campaign.budget) },
                  { label: 'Spent', value: formatCurrency(campaign.spent) },
                  { label: 'Reach', value: campaign.reach.toLocaleString() },
                  { label: 'Duration', value: `${formatDate(campaign.startDate)} → ${formatDate(campaign.endDate)}` },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[11px] text-[var(--muted-foreground)] font-medium mb-0.5">{stat.label}</p>
                    <p className="text-[13px] font-semibold text-[var(--foreground)]">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Budget progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-[var(--muted-foreground)]">Budget utilisation</span>
                  <span className="text-[11px] font-medium">{progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--muted)] rounded-full">
                  <div
                    className={`h-1.5 rounded-full transition-all ${progress >= 90 ? 'bg-red-500' : progress >= 70 ? 'bg-amber-500' : 'bg-[var(--primary)]'}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Campaign"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Create Campaign</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Campaign Title" required placeholder="e.g., Eid Special Offers" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Campaign Type" required options={[{ value: 'basic', label: 'Basic Campaign' }, { value: 'item', label: 'Item Campaign' }]} />
            <Select label="Target Audience" required options={[
              { value: 'all', label: 'All Customers' },
              { value: 'new', label: 'New Users' },
              { value: 'returning', label: 'Returning Customers' },
              { value: 'loyal', label: 'Loyal Customers' },
            ]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Discount (%)" type="number" required placeholder="e.g., 30" />
            <Input label="Budget (৳)" type="number" required placeholder="e.g., 50000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" required />
            <Input label="End Date" type="date" required />
          </div>
          <Textarea label="Description" placeholder="Campaign description..." rows={3} />
        </div>
      </Modal>
    </div>
  );
}

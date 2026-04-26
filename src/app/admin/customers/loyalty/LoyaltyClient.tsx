'use client';

import React, { useState, useMemo } from 'react';
import { Star, Gift, Plus, Minus } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/input';
import { formatCurrency, getInitials } from '@/lib/utils';

interface LoyaltyEntry { id: string; customer: string; phone: string; points: number; pointsValue: number; totalEarned: number; totalRedeemed: number; tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'; }

const TIERS = { Bronze: { min: 0, color: '#cd7f32' }, Silver: { min: 500, color: '#9ca3af' }, Gold: { min: 2000, color: '#f59e0b' }, Platinum: { min: 5000, color: '#3b82f6' } };

const LOYALTY_DATA: LoyaltyEntry[] = Array.from({ length: 35 }, (_, i) => {
  const points = (i * 789) % 8000;
  const tier = points >= 5000 ? 'Platinum' : points >= 2000 ? 'Gold' : points >= 500 ? 'Silver' : 'Bronze';
  return { id: `ly-${i + 1}`, customer: ['Rahim Ahmed', 'Sumaiya Begum', 'Tanvir Khan', 'Nusrat Jahan', 'Karim Ali', 'Fatema Khatun'][i % 6], phone: `+8801${String(600000000 + i * 1123).slice(0, 9)}`, points, pointsValue: Math.round(points * 0.5), totalEarned: points + (i * 234) % 3000, totalRedeemed: (i * 123) % 2000, tier };
});

const TOTAL_POINTS = LOYALTY_DATA.reduce((s, l) => s + l.points, 0);
const AVATAR_COLORS = ['#1aab50', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#005555'];

export function LoyaltyClient() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    if (!search) return LOYALTY_DATA;
    const q = search.toLowerCase();
    return LOYALTY_DATA.filter(l => l.customer.toLowerCase().includes(q));
  }, [search]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const columns: Column<LoyaltyEntry>[] = [
    { key: 'customer', header: 'Customer', render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: AVATAR_COLORS[row.id.charCodeAt(3) % AVATAR_COLORS.length] }}>
          {getInitials(row.customer)}
        </div>
        <div><p className="text-[13px] font-medium">{row.customer}</p><p className="text-[11px] text-[var(--muted-foreground)]">{row.phone}</p></div>
      </div>
    )},
    { key: 'tier', header: 'Tier', render: (v) => {
      const t = v as LoyaltyEntry['tier'];
      return <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-full border" style={{ color: TIERS[t].color, borderColor: `${TIERS[t].color}30`, backgroundColor: `${TIERS[t].color}10` }}>
        <Star className="w-3 h-3 fill-current" />{t}
      </span>;
    }},
    { key: 'points', header: 'Points', sortable: true, render: (v, row) => (
      <div>
        <p className="text-[14px] font-bold text-[var(--foreground)]">{(v as number).toLocaleString()} pts</p>
        <p className="text-[11px] text-[var(--primary)]">≈ {formatCurrency(row.pointsValue)}</p>
      </div>
    )},
    { key: 'totalEarned', header: 'Earned', render: (v) => <span className="text-[12px] text-green-600 font-medium">+{(v as number).toLocaleString()}</span> },
    { key: 'totalRedeemed', header: 'Redeemed', render: (v) => <span className="text-[12px] text-red-500 font-medium">-{(v as number).toLocaleString()}</span> },
    { key: 'id', header: 'Adjust', align: 'center', render: () => (
      <div className="flex items-center justify-center gap-1">
        <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-green-50 hover:text-green-600 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader title="Loyalty Points" subtitle="Manage customer loyalty tiers and point balances"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Customers' }, { label: 'Loyalty Points' }]} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Points Issued" value={TOTAL_POINTS.toLocaleString()} icon={<Star className="w-5 h-5" />} color="warning" />
        <StatCard title="Platinum Members" value={LOYALTY_DATA.filter(l => l.tier === 'Platinum').length.toString()} icon={<Gift className="w-5 h-5" />} color="info" />
        <StatCard title="Gold Members" value={LOYALTY_DATA.filter(l => l.tier === 'Gold').length.toString()} icon={<Star className="w-5 h-5" />} color="primary" />
        <StatCard title="Total Members" value={LOYALTY_DATA.length.toString()} icon={<Gift className="w-5 h-5" />} color="secondary" />
      </div>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search customers..."
            className="h-9 px-3 w-full max-w-sm rounded-[var(--radius)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)]" />
        </div>
        <DataTable columns={columns} data={paginated} keyField="id" className="rounded-none border-t-0" />
        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>
    </div>
  );
}

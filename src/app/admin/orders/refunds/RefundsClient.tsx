'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Refund {
  id: string;
  orderId: string;
  customer: string;
  store: string;
  amount: number;
  reason: string;
  requestedAt: string;
  status: 'new' | 'approved' | 'rejected' | 'refunded';
}

const REASONS = ['Damaged product', 'Wrong item', 'Late delivery', 'Not delivered', 'Quality issue', 'Changed mind'];
const REFUNDS: Refund[] = Array.from({ length: 35 }, (_, i) => ({
  id: `rfnd-${i + 1}`,
  orderId: `AM-${10000 + i * 17}`,
  customer: ['Rahim Ahmed', 'Sumaiya Begum', 'Tanvir Khan', 'Nusrat Jahan', 'Karim Ali'][i % 5],
  store: ['Dhaka Fresh Market', 'City Pharmacy', 'BD Electronics', 'Fashion Hub BD'][i % 4],
  amount: 100 + (i * 234) % 8000,
  reason: REASONS[i % REASONS.length],
  requestedAt: new Date(2026, 3, 1 + (i % 20)).toISOString(),
  status: i % 6 === 0 ? 'refunded' : i % 5 === 0 ? 'rejected' : i % 3 === 0 ? 'approved' : 'new',
}));

const TABS = [
  { id: 'all', label: 'All', count: REFUNDS.length },
  { id: 'new', label: 'New', count: REFUNDS.filter(r => r.status === 'new').length },
  { id: 'approved', label: 'Approved', count: REFUNDS.filter(r => r.status === 'approved').length },
  { id: 'refunded', label: 'Refunded', count: REFUNDS.filter(r => r.status === 'refunded').length },
  { id: 'rejected', label: 'Rejected', count: REFUNDS.filter(r => r.status === 'rejected').length },
];

export function RefundsClient() {
  const [activeTab, setActiveTab] = useState('new');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const filtered = activeTab === 'all' ? REFUNDS : REFUNDS.filter(r => r.status === activeTab);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const columns: Column<Refund>[] = [
    { key: 'orderId', header: 'Order ID', render: (v) => <span className="font-mono text-[12px] font-medium text-[var(--secondary)]">{v as string}</span> },
    { key: 'customer', header: 'Customer', render: (v) => <span className="text-[13px] font-medium">{v as string}</span> },
    { key: 'store', header: 'Store', render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{v as string}</span> },
    { key: 'amount', header: 'Amount', render: (v) => <span className="text-[13px] font-bold text-red-500">-{formatCurrency(v as number)}</span> },
    { key: 'reason', header: 'Reason', render: (v) => <Badge variant="warning">{v as string}</Badge> },
    { key: 'requestedAt', header: 'Requested', render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{formatDate(v as string)}</span> },
    { key: 'status', header: 'Status', render: (v) => <Badge variant={v === 'refunded' ? 'success' : v === 'approved' ? 'info' : v === 'new' ? 'warning' : 'danger'} dot>{(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}</Badge> },
    { key: 'id', header: 'Actions', align: 'center', render: (_, row) => (
      <div className="flex items-center justify-center gap-1">
        <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
        {row.status === 'new' && <>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-green-50 hover:text-green-600 transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /></button>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors"><XCircle className="w-3.5 h-3.5" /></button>
        </>}
      </div>
    )},
  ];

  const totalRefunded = REFUNDS.filter(r => r.status === 'refunded').reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Order Refunds"
        subtitle="Review and process customer refund requests"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Orders' }, { label: 'Refunds' }]}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="New Requests" value={REFUNDS.filter(r => r.status === 'new').length.toString()} color="warning" />
        <StatCard title="Pending Approval" value={REFUNDS.filter(r => r.status === 'approved').length.toString()} color="info" />
        <StatCard title="Total Refunded" value={formatCurrency(totalRefunded)} color="danger" />
        <StatCard title="Rejection Rate" value={`${Math.round((REFUNDS.filter(r => r.status === 'rejected').length / REFUNDS.length) * 100)}%`} color="secondary" />
      </div>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 pt-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} />
        </div>
        <DataTable columns={columns} data={paginated} keyField="id" className="rounded-none border-t-0" />
        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Eye, Wallet, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Withdrawal {
  id: string;
  reqId: string;
  store: string;
  storeType: string;
  bank: string;
  account: string;
  amount: number;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
}

const STORE_NAMES = ['Dhaka Fresh Market', 'City Pharmacy', 'BD Electronics', 'Fashion Hub BD', 'Green Basket'];
const BANKS = ['Dutch-Bangla Bank', 'Brac Bank', 'Islami Bank', 'Southeast Bank', 'Standard Chartered'];

const WITHDRAWALS: Withdrawal[] = Array.from({ length: 45 }, (_, i) => ({
  id: `wr-${i + 1}`,
  reqId: `WR${String(10000 + i * 7)}`,
  store: STORE_NAMES[i % STORE_NAMES.length],
  storeType: ['Grocery', 'Pharmacy', 'Electronics', 'Fashion', 'Grocery'][i % 5],
  bank: BANKS[i % BANKS.length],
  account: `**** **** ${String(1000 + i * 37).slice(0, 4)}`,
  amount: 2000 + (i * 1890) % 80000,
  requestedAt: new Date(2026, 3, 1 + (i % 20)).toISOString(),
  status: i % 5 === 0 ? 'paid' : i % 7 === 0 ? 'rejected' : i % 4 === 0 ? 'approved' : 'pending',
}));

const PENDING_AMT = WITHDRAWALS.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);
const PAID_AMT = WITHDRAWALS.filter(w => w.status === 'paid').reduce((s, w) => s + w.amount, 0);

const TABS = [
  { id: 'all', label: 'All', count: WITHDRAWALS.length },
  { id: 'pending', label: 'Pending', count: WITHDRAWALS.filter(w => w.status === 'pending').length },
  { id: 'approved', label: 'Approved', count: WITHDRAWALS.filter(w => w.status === 'approved').length },
  { id: 'paid', label: 'Paid', count: WITHDRAWALS.filter(w => w.status === 'paid').length },
  { id: 'rejected', label: 'Rejected', count: WITHDRAWALS.filter(w => w.status === 'rejected').length },
];

export function WithdrawalsClient() {
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Withdrawal | null>(null);
  const PER_PAGE = 10;

  const filtered = useMemo(() => activeTab === 'all' ? WITHDRAWALS : WITHDRAWALS.filter(w => w.status === activeTab), [activeTab]);
  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const columns: Column<Withdrawal>[] = [
    { key: 'reqId', header: 'Request ID', render: (v) => <span className="font-mono text-[12px] font-medium text-[var(--secondary)]">{v as string}</span> },
    { key: 'store', header: 'Store', render: (_, row) => (
      <div className="text-[12px]">
        <p className="font-semibold text-[var(--foreground)]">{row.store}</p>
        <p className="text-[var(--muted-foreground)]">{row.storeType}</p>
      </div>
    )},
    { key: 'bank', header: 'Bank Account', render: (_, row) => (
      <div className="text-[12px]">
        <p className="flex items-center gap-1"><Building2 className="w-3 h-3 text-[var(--muted-foreground)]" />{row.bank}</p>
        <p className="text-[var(--muted-foreground)] font-mono">{row.account}</p>
      </div>
    )},
    { key: 'amount', header: 'Amount', sortable: true, render: (v) => <span className="text-[14px] font-bold text-[var(--foreground)]">{formatCurrency(v as number)}</span> },
    { key: 'requestedAt', header: 'Requested', render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{formatDate(v as string)}</span> },
    { key: 'status', header: 'Status', render: (v) => <Badge variant={v === 'paid' ? 'success' : v === 'approved' ? 'info' : v === 'pending' ? 'warning' : 'danger'} dot>{(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}</Badge> },
    { key: 'id', header: 'Actions', align: 'center', render: (_, row) => (
      <div className="flex items-center justify-center gap-1">
        <button onClick={() => setSelected(row)} className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
        {row.status === 'pending' && <>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-green-50 hover:text-green-600 transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /></button>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors"><XCircle className="w-3.5 h-3.5" /></button>
        </>}
      </div>
    )},
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Withdrawal Requests"
        subtitle="Review and process store payout withdrawal requests"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Withdrawal Requests' }]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Pending Requests" value={WITHDRAWALS.filter(w => w.status === 'pending').length.toString()} icon={<Wallet className="w-5 h-5" />} color="warning" />
        <StatCard title="Pending Amount" value={formatCurrency(PENDING_AMT)} icon={<Wallet className="w-5 h-5" />} color="warning" />
        <StatCard title="Paid This Month" value={formatCurrency(PAID_AMT)} icon={<CheckCircle2 className="w-5 h-5" />} color="success" />
        <StatCard title="Total Requests" value={WITHDRAWALS.length.toString()} icon={<Wallet className="w-5 h-5" />} color="secondary" />
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 pt-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} />
        </div>
        <DataTable columns={columns} data={paginated} keyField="id" className="rounded-none border-t-0" />
        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>

      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Withdrawal Request Detail" size="sm"
          footer={<>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            {selected.status === 'pending' && <>
              <Button variant="danger" onClick={() => setSelected(null)}>Reject</Button>
              <Button variant="success" onClick={() => setSelected(null)}>Approve & Pay</Button>
            </>}
          </>}>
          <div className="space-y-3">
            {[
              { label: 'Request ID', value: selected.reqId },
              { label: 'Store', value: selected.store },
              { label: 'Amount', value: formatCurrency(selected.amount) },
              { label: 'Bank', value: selected.bank },
              { label: 'Account No.', value: selected.account },
              { label: 'Requested', value: formatDate(selected.requestedAt) },
              { label: 'Status', value: selected.status },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-[12px] text-[var(--muted-foreground)] font-medium">{item.label}</span>
                <span className="text-[13px] font-semibold text-[var(--foreground)]">{item.value}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

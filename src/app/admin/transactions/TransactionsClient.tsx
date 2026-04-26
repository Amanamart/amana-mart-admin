'use client';

import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Search } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Transaction {
  id: string;
  trxId: string;
  type: 'credit' | 'debit';
  category: 'order_payment' | 'store_payout' | 'refund' | 'wallet_topup' | 'commission';
  amount: number;
  entity: string;
  entityType: 'customer' | 'store' | 'system';
  method: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

const METHODS = ['bKash', 'Nagad', 'Rocket', 'Credit Card', 'COD', 'Wallet'];
const ENTITIES = ['Rahman Grocery', 'Rahim Pharmacy', 'City Electronics', 'Customer #3421', 'Amana System', 'Fashion Hub BD'];

const TRANSACTIONS: Transaction[] = Array.from({ length: 80 }, (_, i) => ({
  id: `trx-${i + 1}`,
  trxId: `TXN${String(1000000 + i * 37).slice(0, 7)}`,
  type: i % 3 === 0 ? 'debit' : 'credit',
  category: (['order_payment', 'store_payout', 'refund', 'wallet_topup', 'commission'] as const)[i % 5],
  amount: 100 + (i * 287) % 50000,
  entity: ENTITIES[i % ENTITIES.length],
  entityType: i % 5 === 4 ? 'system' : i % 3 === 0 ? 'store' : 'customer',
  method: METHODS[i % METHODS.length],
  status: i % 12 === 0 ? 'failed' : i % 8 === 0 ? 'pending' : 'completed',
  date: new Date(2026, 3, 1 + (i % 20)).toISOString(),
}));

const TOTAL_CREDIT = TRANSACTIONS.filter(t => t.type === 'credit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
const TOTAL_DEBIT = TRANSACTIONS.filter(t => t.type === 'debit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);

const CATEGORY_LABELS: Record<string, string> = {
  order_payment: 'Order Payment', store_payout: 'Store Payout', refund: 'Refund', wallet_topup: 'Wallet Top-up', commission: 'Commission',
};

const TABS = [
  { id: 'all', label: 'All', count: TRANSACTIONS.length },
  { id: 'credit', label: 'Credit', count: TRANSACTIONS.filter(t => t.type === 'credit').length },
  { id: 'debit', label: 'Debit', count: TRANSACTIONS.filter(t => t.type === 'debit').length },
];

export function TransactionsClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = useMemo(() => {
    let list = TRANSACTIONS;
    if (activeTab !== 'all') list = list.filter(t => t.type === activeTab);
    if (search) list = list.filter(t => t.trxId.toLowerCase().includes(search.toLowerCase()) || t.entity.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [activeTab, search]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const columns: Column<Transaction>[] = [
    { key: 'trxId', header: 'Transaction ID', render: (v) => <span className="font-mono text-[12px] font-medium text-[var(--secondary)]">{v as string}</span> },
    { key: 'type', header: 'Type', render: (_, row) => (
      <div className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${row.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
        {row.type === 'credit' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
        {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
      </div>
    )},
    { key: 'category', header: 'Category', render: (v) => <Badge variant="muted">{CATEGORY_LABELS[v as string]}</Badge> },
    { key: 'amount', header: 'Amount', sortable: true, render: (_, row) => (
      <span className={`text-[13px] font-bold ${row.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
        {row.type === 'credit' ? '+' : '-'}{formatCurrency(row.amount)}
      </span>
    )},
    { key: 'entity', header: 'Entity', render: (_, row) => (
      <div className="text-[12px]">
        <p className="font-medium">{row.entity}</p>
        <p className="text-[var(--muted-foreground)] capitalize">{row.entityType}</p>
      </div>
    )},
    { key: 'method', header: 'Method', render: (v) => (
      <span className="inline-flex items-center gap-1 text-[12px]"><CreditCard className="w-3 h-3 text-[var(--muted-foreground)]" />{v as string}</span>
    )},
    { key: 'status', header: 'Status', render: (v) => <Badge variant={v === 'completed' ? 'success' : v === 'pending' ? 'warning' : 'danger'} dot>{(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}</Badge> },
    { key: 'date', header: 'Date', render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{formatDate(v as string)}</span> },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Transactions"
        subtitle="Full ledger of all financial transactions on the platform"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Transactions' }]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Credit" value={formatCurrency(TOTAL_CREDIT)} icon={<ArrowDownLeft className="w-5 h-5" />} color="success" change={12.4} changePeriod="vs last month" />
        <StatCard title="Total Debit" value={formatCurrency(TOTAL_DEBIT)} icon={<ArrowUpRight className="w-5 h-5" />} color="danger" change={-8.1} changePeriod="vs last month" />
        <StatCard title="Net Balance" value={formatCurrency(TOTAL_CREDIT - TOTAL_DEBIT)} icon={<CreditCard className="w-5 h-5" />} color="primary" />
        <StatCard title="Total Transactions" value={TRANSACTIONS.length.toLocaleString()} icon={<CreditCard className="w-5 h-5" />} color="secondary" />
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 pt-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} />
        </div>
        <div className="px-4 py-3 flex items-center gap-3 border-t border-[var(--border)]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by TXN ID or entity..."
              className="w-full h-9 pl-9 pr-3 rounded-[var(--radius)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)]" />
          </div>
          <button className="h-9 px-4 rounded-[var(--radius)] border border-[var(--border)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-2">
            Export CSV
          </button>
        </div>
        <DataTable columns={columns} data={paginated} keyField="id" className="rounded-none border-none" />
        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>
    </div>
  );
}

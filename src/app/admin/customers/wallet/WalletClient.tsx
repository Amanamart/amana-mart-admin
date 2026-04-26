'use client';

import React, { useState, useMemo } from 'react';
import { Wallet, Plus, Minus, Eye } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { formatCurrency, getInitials } from '@/lib/utils';

interface WalletEntry { id: string; customer: string; phone: string; balance: number; totalAdded: number; totalUsed: number; status: 'active' | 'frozen'; }

const WALLET_DATA: WalletEntry[] = Array.from({ length: 40 }, (_, i) => ({
  id: `w-${i + 1}`,
  customer: ['Rahim Ahmed', 'Sumaiya Begum', 'Tanvir Khan', 'Nusrat Jahan', 'Karim Ali', 'Fatema Khatun'][i % 6],
  phone: `+8801${String(700000000 + i * 1123).slice(0, 9)}`,
  balance: (i * 1234) % 20000,
  totalAdded: 5000 + (i * 890) % 50000,
  totalUsed: 2000 + (i * 567) % 40000,
  status: i % 12 === 0 ? 'frozen' : 'active',
}));

const AVATAR_COLORS = ['#1aab50', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#005555'];
const TOTAL_BALANCE = WALLET_DATA.reduce((s, w) => s + w.balance, 0);

export function WalletClient() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [adjustModal, setAdjustModal] = useState(false);
  const [selected, setSelected] = useState<WalletEntry | null>(null);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    if (!search) return WALLET_DATA;
    const q = search.toLowerCase();
    return WALLET_DATA.filter(w => w.customer.toLowerCase().includes(q) || w.phone.includes(q));
  }, [search]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const columns: Column<WalletEntry>[] = [
    { key: 'customer', header: 'Customer', render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: AVATAR_COLORS[row.id.charCodeAt(2) % AVATAR_COLORS.length] }}>
          {getInitials(row.customer)}
        </div>
        <div><p className="text-[13px] font-medium">{row.customer}</p><p className="text-[11px] text-[var(--muted-foreground)]">{row.phone}</p></div>
      </div>
    )},
    { key: 'balance', header: 'Current Balance', sortable: true, render: (v) => <span className="text-[14px] font-bold text-[var(--primary)]">{formatCurrency(v as number)}</span> },
    { key: 'totalAdded', header: 'Total Added', render: (v) => <span className="text-[12px] text-green-600 font-medium">+{formatCurrency(v as number)}</span> },
    { key: 'totalUsed', header: 'Total Used', render: (v) => <span className="text-[12px] text-red-500 font-medium">-{formatCurrency(v as number)}</span> },
    { key: 'status', header: 'Status', render: (v) => <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${v === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}</span> },
    { key: 'id', header: 'Actions', align: 'center', render: (_, row) => (
      <div className="flex items-center justify-center gap-1">
        <button onClick={() => { setSelected(row); setAdjustModal(true); }} className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-green-50 hover:text-green-600 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader title="Customer Wallet" subtitle="Manage customer wallet balances and transactions"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Customers' }, { label: 'Wallet' }]} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={formatCurrency(TOTAL_BALANCE)} icon={<Wallet className="w-5 h-5" />} color="primary" />
        <StatCard title="Active Wallets" value={WALLET_DATA.filter(w => w.status === 'active').length.toString()} icon={<Wallet className="w-5 h-5" />} color="success" />
        <StatCard title="Frozen Wallets" value={WALLET_DATA.filter(w => w.status === 'frozen').length.toString()} icon={<Wallet className="w-5 h-5" />} color="warning" />
        <StatCard title="Avg Balance" value={formatCurrency(Math.round(TOTAL_BALANCE / WALLET_DATA.length))} icon={<Wallet className="w-5 h-5" />} color="secondary" />
      </div>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 py-3 flex items-center gap-3 border-b border-[var(--border)]">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search customers..."
            className="flex-1 max-w-sm h-9 px-3 rounded-[var(--radius)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)]" />
        </div>
        <DataTable columns={columns} data={paginated} keyField="id" className="rounded-none border-t-0" />
        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>
      {adjustModal && selected && (
        <Modal open={adjustModal} onClose={() => setAdjustModal(false)} title={`Adjust Wallet — ${selected.customer}`} size="sm"
          footer={<><Button variant="outline" onClick={() => setAdjustModal(false)}>Cancel</Button><Button variant="primary" onClick={() => setAdjustModal(false)}>Apply Adjustment</Button></>}>
          <div className="space-y-4">
            <div className="p-3 bg-[var(--muted)] rounded-[var(--radius-md)] text-center">
              <p className="text-[12px] text-[var(--muted-foreground)]">Current Balance</p>
              <p className="text-[20px] font-bold text-[var(--primary)]">{formatCurrency(selected.balance)}</p>
            </div>
            <Select label="Adjustment Type" required options={[{ value: 'add', label: '+ Add Funds' }, { value: 'deduct', label: '- Deduct Funds' }]} />
            <Input label="Amount (৳)" type="number" required placeholder="Enter amount" />
            <Input label="Reason / Note" placeholder="e.g., Refund adjustment" />
          </div>
        </Modal>
      )}
    </div>
  );
}

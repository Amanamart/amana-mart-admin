'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FilterBar } from '@/components/admin/FilterBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Coupon {
  id: string;
  code: string;
  title: string;
  type: 'percentage' | 'fixed';
  discount: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  active: boolean;
}

const COUPONS: Coupon[] = [
  { id: '1', code: 'EID70', title: 'Eid Special 70% Off', type: 'percentage', discount: 70, minOrder: 500, maxDiscount: 2000, usageLimit: 500, usedCount: 234, validFrom: '2026-04-01', validTo: '2026-04-30', active: true },
  { id: '2', code: 'WELCOME150', title: 'New User Welcome', type: 'fixed', discount: 150, minOrder: 300, maxDiscount: 150, usageLimit: 1000, usedCount: 567, validFrom: '2026-01-01', validTo: '2026-12-31', active: true },
  { id: '3', code: 'FLAT50', title: 'Flat ৳50 Off', type: 'fixed', discount: 50, minOrder: 200, maxDiscount: 50, usageLimit: 2000, usedCount: 1234, validFrom: '2026-03-01', validTo: '2026-05-31', active: true },
  { id: '4', code: 'SUMMER25', title: 'Summer 25% Off', type: 'percentage', discount: 25, minOrder: 400, maxDiscount: 500, usageLimit: 300, usedCount: 89, validFrom: '2026-06-01', validTo: '2026-08-31', active: false },
  { id: '5', code: 'GROCERY10', title: 'Grocery 10% Off', type: 'percentage', discount: 10, minOrder: 150, maxDiscount: 200, usageLimit: 5000, usedCount: 2341, validFrom: '2026-01-01', validTo: '2026-12-31', active: true },
  { id: '6', code: 'PREMIUM200', title: 'Premium Member ৳200 Off', type: 'fixed', discount: 200, minOrder: 1000, maxDiscount: 200, usageLimit: 100, usedCount: 43, validFrom: '2026-04-15', validTo: '2026-05-15', active: true },
];

export function CouponsClient() {
  const [coupons, setCoupons] = useState(COUPONS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = coupons.filter(
    (c) => c.code.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      header: 'Coupon Code',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-[13px] bg-[var(--primary-light)] text-[var(--primary-dark)] px-2 py-1 rounded">
            {row.code}
          </span>
          <button
            onClick={() => copyCode(row.code, row.id)}
            className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
            title="Copy code"
          >
            {copiedId === row.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      ),
    },
    { key: 'title', header: 'Title', render: (v) => <span className="text-[13px] font-medium">{v as string}</span> },
    {
      key: 'type',
      header: 'Discount',
      render: (_, row) => (
        <span className="text-[13px] font-semibold text-[var(--primary)]">
          {row.type === 'percentage' ? `${row.discount}%` : formatCurrency(row.discount)}
        </span>
      ),
    },
    {
      key: 'minOrder',
      header: 'Min. Order',
      render: (v) => <span className="text-[12px]">{formatCurrency(v as number)}</span>,
    },
    {
      key: 'usedCount',
      header: 'Usage',
      align: 'center',
      render: (_, row) => (
        <div className="text-center">
          <p className="text-[13px] font-medium">{row.usedCount} / {row.usageLimit}</p>
          <div className="h-1 bg-[var(--muted)] rounded-full mt-1 w-16 mx-auto">
            <div
              className="h-1 bg-[var(--primary)] rounded-full"
              style={{ width: `${Math.min((row.usedCount / row.usageLimit) * 100, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'validTo',
      header: 'Valid Until',
      render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{formatDate(v as string)}</span>,
    },
    {
      key: 'active',
      header: 'Status',
      render: (v) => (
        <Badge variant={v ? 'success' : 'muted'} dot>
          {v ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setCoupons((prev) => prev.map((c) => c.id === row.id ? { ...c, active: !c.active } : c))}
            className="text-[11px] px-2 py-1 rounded border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            {row.active ? 'Disable' : 'Enable'}
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Coupons"
        subtitle="Create and manage discount coupons"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Promotions' }, { label: 'Coupons' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Add Coupon
          </Button>
        }
      />

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)]">
        <FilterBar
          searchValue={search}
          searchPlaceholder="Search coupons..."
          onSearchChange={setSearch}
          className="rounded-b-none"
        />
        <DataTable columns={columns} data={filtered} keyField="id" className="rounded-t-none border-t-0" />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Coupon"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Create Coupon</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Coupon Title" required placeholder="e.g., Eid Special Sale" />
          <Input label="Coupon Code" required placeholder="e.g., EID70" hint="Customers will enter this at checkout" />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Discount Type"
              required
              options={[
                { value: 'percentage', label: 'Percentage (%)' },
                { value: 'fixed', label: 'Fixed Amount (৳)' },
              ]}
            />
            <Input label="Discount Value" required type="number" placeholder="e.g., 70" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Min. Order Amount" type="number" placeholder="৳500" />
            <Input label="Max. Discount" type="number" placeholder="৳2000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Valid From" type="date" required />
            <Input label="Valid Until" type="date" required />
          </div>
          <Input label="Usage Limit" type="number" placeholder="e.g., 500" />
        </div>
      </Modal>
    </div>
  );
}

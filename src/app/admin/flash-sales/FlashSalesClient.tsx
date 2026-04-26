'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Zap, Clock, Tag } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';

interface FlashSale {
  id: string;
  title: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  products: number;
  status: 'active' | 'upcoming' | 'expired';
  orders: number;
}

const FLASH_SALES: FlashSale[] = [
  { id: '1', title: 'Eid Mega Flash Sale', discount: 70, discountType: 'percentage', startDate: '2026-04-20', endDate: '2026-04-21', products: 48, status: 'active', orders: 234 },
  { id: '2', title: 'Friday Night Deals', discount: 50, discountType: 'percentage', startDate: '2026-04-18', endDate: '2026-04-18', products: 24, status: 'expired', orders: 89 },
  { id: '3', title: 'Weekend Grocery Rush', discount: 200, discountType: 'fixed', startDate: '2026-04-26', endDate: '2026-04-27', products: 36, status: 'upcoming', orders: 0 },
  { id: '4', title: 'Electronics Blowout', discount: 30, discountType: 'percentage', startDate: '2026-04-15', endDate: '2026-04-15', products: 18, status: 'expired', orders: 156 },
  { id: '5', title: 'Ramadan Special', discount: 40, discountType: 'percentage', startDate: '2026-05-01', endDate: '2026-05-03', products: 60, status: 'upcoming', orders: 0 },
];

const TABS = [
  { id: 'all', label: 'All Sales', count: FLASH_SALES.length },
  { id: 'active', label: 'Active', count: FLASH_SALES.filter(f => f.status === 'active').length },
  { id: 'upcoming', label: 'Upcoming', count: FLASH_SALES.filter(f => f.status === 'upcoming').length },
  { id: 'expired', label: 'Expired', count: FLASH_SALES.filter(f => f.status === 'expired').length },
];

export function FlashSalesClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = FLASH_SALES;
    if (activeTab !== 'all') list = list.filter(f => f.status === activeTab);
    if (search) list = list.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [activeTab, search]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const columns: Column<FlashSale>[] = [
    {
      key: 'title',
      header: 'Flash Sale',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center shrink-0 ${
            row.status === 'active' ? 'bg-red-100' : row.status === 'upcoming' ? 'bg-blue-50' : 'bg-[var(--muted)]'
          }`}>
            <Zap className={`w-5 h-5 ${row.status === 'active' ? 'text-red-500' : row.status === 'upcoming' ? 'text-blue-500' : 'text-[var(--muted-foreground)]'}`} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--foreground)]">{row.title}</p>
            <p className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
              <Tag className="w-3 h-3" /> {row.products} products
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'discount',
      header: 'Discount',
      render: (_, row) => (
        <span className="text-[13px] font-bold text-red-500">
          {row.discountType === 'percentage' ? `${row.discount}%` : formatCurrency(row.discount)} OFF
        </span>
      ),
    },
    {
      key: 'startDate',
      header: 'Duration',
      render: (_, row) => (
        <div className="text-[12px]">
          <p className="font-medium">{formatDate(row.startDate)}</p>
          <p className="text-[var(--muted-foreground)] flex items-center gap-1">
            <Clock className="w-3 h-3" /> ends {formatDate(row.endDate)}
          </p>
        </div>
      ),
    },
    {
      key: 'orders',
      header: 'Orders',
      align: 'center',
      render: (v) => <span className="text-[13px] font-semibold">{(v as number).toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (v) => {
        const s = v as string;
        return (
          <Badge variant={s === 'active' ? 'danger' : s === 'upcoming' ? 'info' : 'muted'} dot>
            {s === 'active' ? '🔴 Live Now' : s === 'upcoming' ? '⏳ Upcoming' : 'Expired'}
          </Badge>
        );
      },
    },
    {
      key: 'id',
      header: 'Actions',
      align: 'center',
      render: () => (
        <div className="flex items-center justify-center gap-1">
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-amber-50 hover:text-amber-600 transition-colors">
            <Edit className="w-3.5 h-3.5" />
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
        title="Flash Sales"
        subtitle="Create time-limited discount events to drive urgency"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Flash Sales' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Create Flash Sale
          </Button>
        }
      />

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 pt-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} />
        </div>
        <FilterBar
          className="rounded-none border-none border-t border-[var(--border)] mt-0"
          searchValue={search}
          searchPlaceholder="Search flash sales..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          onExport={() => {}}
        />
        <DataTable columns={columns} data={paginated} keyField="id" className="rounded-none border-none" />
        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Flash Sale"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Create Sale</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Sale Title" required placeholder="e.g., Eid Mega Flash Sale" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Discount Type" required options={[{ value: 'percentage', label: 'Percentage (%)' }, { value: 'fixed', label: 'Fixed Amount (৳)' }]} />
            <Input label="Discount Value" required type="number" placeholder="e.g., 70" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date & Time" type="datetime-local" required />
            <Input label="End Date & Time" type="datetime-local" required />
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[var(--radius-md)]">
            <p className="text-[12px] text-amber-700 font-medium">⚡ Products for this flash sale can be added after creation from the sale detail page.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

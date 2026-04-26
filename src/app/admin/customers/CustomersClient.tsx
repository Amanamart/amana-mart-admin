'use client';

import React, { useState, useMemo } from 'react';
import { Edit, XCircle, Wallet, Star } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  totalOrders: number;
  totalSpent: number;
  wallet: number;
  loyaltyPoints: number;
  status: 'active' | 'blocked';
  joinDate: string;
}

const ZONES = ['Dhaka North', 'Dhaka South', 'Chattogram', 'Sylhet', 'Rajshahi'];

const CUSTOMERS: Customer[] = Array.from({ length: 70 }, (_, i) => ({
  id: `cust-${i + 1}`,
  name: ['Rahim Ahmed', 'Fatima Begum', 'Karim Hossain', 'Nasrin Islam', 'Hasan Ali', 'Sumaiya Khan', 'Mohammad Ali', 'Rima Akter'][i % 8],
  email: `customer${i + 1}@example.com`,
  phone: `+8801${String(700000000 + i * 1234).slice(0, 9)}`,
  zone: ZONES[i % ZONES.length],
  totalOrders: 1 + (i * 13) % 120,
  totalSpent: 500 + (i * 890) % 150000,
  wallet: (i * 234) % 5000,
  loyaltyPoints: (i * 157) % 10000,
  status: i % 10 === 0 ? 'blocked' : 'active',
  joinDate: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
}));

const TABS = [
  { id: 'all', label: 'All Customers', count: CUSTOMERS.length },
  { id: 'active', label: 'Active', count: CUSTOMERS.filter((c) => c.status === 'active').length },
  { id: 'blocked', label: 'Blocked', count: CUSTOMERS.filter((c) => c.status === 'blocked').length },
];

export function CustomersClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = CUSTOMERS;
    if (activeTab !== 'all') list = list.filter((c) => c.status === activeTab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }
    return list;
  }, [activeTab, search]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const avatarColors = ['#1aab50', '#0369a1', '#7c3aed', '#d97706', '#dc2626', '#0891b2'];

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: avatarColors[row.id.charCodeAt(5) % avatarColors.length] }}
          >
            {getInitials(row.name)}
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--foreground)]">{row.name}</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (v) => <span className="text-[12px]">{v as string}</span> },
    { key: 'zone', header: 'Zone', render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{v as string}</span> },
    {
      key: 'totalOrders',
      header: 'Orders',
      align: 'center',
      sortable: true,
      render: (v) => <span className="font-semibold text-[13px]">{v as number}</span>,
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      align: 'right',
      sortable: true,
      render: (v) => <span className="font-semibold text-[13px]">{formatCurrency(v as number)}</span>,
    },
    {
      key: 'wallet',
      header: 'Wallet',
      align: 'right',
      render: (v) => (
        <span className="inline-flex items-center gap-1 text-[12px] text-blue-600 font-medium">
          <Wallet className="w-3 h-3" />
          {formatCurrency(v as number)}
        </span>
      ),
    },
    {
      key: 'loyaltyPoints',
      header: 'Points',
      align: 'center',
      render: (v) => (
        <span className="inline-flex items-center gap-1 text-[12px] text-amber-600 font-medium">
          <Star className="w-3 h-3 fill-amber-400" />
          {(v as number).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'joinDate',
      header: 'Joined',
      render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{formatDate(v as string)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (v) => (
        <Badge variant={v === 'active' ? 'success' : 'danger'} dot>
          {(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      align: 'center',
      render: () => (
        <div className="flex items-center justify-center gap-1">
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors" title="Block">
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Customers"
        subtitle="Manage registered customer accounts"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Customers' }]}
      />

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 pt-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} />
        </div>
        <FilterBar
          className="rounded-none border-none border-t border-[var(--border)] mt-0"
          searchValue={search}
          searchPlaceholder="Search by name, email, phone..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          onExport={() => {}}
        />
        <DataTable columns={columns} data={paginated} keyField="id" className="rounded-none border-none" />
        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>
    </div>
  );
}

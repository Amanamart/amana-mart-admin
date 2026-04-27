'use client';

import React, { useState } from 'react';
import { Plus, Eye, Edit, CheckCircle2, XCircle, Star, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/button';
import { formatCurrency, getTranslation } from '@/lib/utils';
import { useStores } from '@/hooks/useAdminDashboard';


interface Store {
  id: string;
  name: string;
  owner: string;
  phone: string;
  zone: string;
  module: string;
  revenue: number;
  orders: number;
  rating: number;
  status: 'active' | 'pending' | 'blocked';
  joinDate: string;
}

export function StoresClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const { data: storesData, isLoading } = useStores({
    search,
    status: activeTab === 'all' ? undefined : activeTab,
    page,
    limit: PER_PAGE,
  });

  const stores = (storesData as any)?.stores || [];
  const total = (storesData as any)?.total || 0;

  const TABS = [
    { id: 'all', label: 'All Stores', count: total },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending Approval' },
    { id: 'blocked', label: 'Blocked' },
  ];



  const columns: Column<any>[] = [
    {
      key: 'name',
      header: 'Store',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[var(--radius)] flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: `hsl(${row.name.charCodeAt(0) * 5 + 140}, 55%, 45%)` }}
          >
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--foreground)]">{row.name}</p>
            <p className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {row.zone?.name || 'No Zone'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (_, row) => (
        <div>
          <p className="text-[13px] font-medium">{row.owner?.name || 'System'}</p>
          <p className="text-[11px] text-[var(--muted-foreground)]">{row.owner?.phone || 'N/A'}</p>
        </div>
      ),
    },
    { key: 'module', header: 'Module', render: (v: any) => <Badge variant="info">{getTranslation(v?.name, 'en') || 'Default'}</Badge> },

    {
      key: 'orders',
      header: 'Orders',
      align: 'center',
      sortable: true,
      render: (v) => <span className="font-semibold text-[13px]">{(v as number).toLocaleString()}</span>,
    },
    {
      key: 'revenue',
      header: 'Revenue',
      align: 'right',
      sortable: true,
      render: (v) => <span className="font-semibold text-[13px]">{formatCurrency(v as number)}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      align: 'center',
      render: (v) => (
        <span className="inline-flex items-center gap-1 text-[12px] font-medium">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          {v as number}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (v) => {
        const s = v as string;
        return (
          <Badge variant={s === 'active' ? 'success' : s === 'pending' ? 'warning' : 'danger'} dot>
            {s.charAt(0).toUpperCase() + s.slice(1)}
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
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-50 hover:text-blue-600 transition-colors" title="View">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-green-50 hover:text-green-600 transition-colors" title="Approve">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors" title="Block">
            <XCircle className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit">
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Stores"
        subtitle="Manage all marketplace vendors and stores"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Stores' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Add Store
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
          searchPlaceholder="Search store, owner, zone..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          onExport={() => {}}
        />
        <DataTable columns={columns} data={stores} loading={isLoading} keyField="id" className="rounded-none border-none" />
        <TablePagination page={page} perPage={PER_PAGE} total={total} onPageChange={setPage} />

      </div>
    </div>
  );
}

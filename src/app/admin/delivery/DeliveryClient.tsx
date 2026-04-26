'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Eye, Star, Bike, Phone, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';

interface DeliveryMan {
  id: string;
  name: string;
  phone: string;
  zone: string;
  vehicle: string;
  orders: number;
  rating: number;
  earnings: number;
  status: 'active' | 'offline' | 'pending' | 'blocked';
  online: boolean;
}

const ZONES = ['Dhaka North', 'Dhaka South', 'Chattogram', 'Sylhet', 'Rajshahi'];
const VEHICLES = ['Motorcycle', 'Bicycle', 'Car', 'Van'];

const DELIVERY_MEN: DeliveryMan[] = Array.from({ length: 40 }, (_, i) => ({
  id: `dm-${i + 1}`,
  name: ['Karim Rider', 'Rahim Express', 'Hasan Delivery', 'Ali Flash', 'Salam Quick'][i % 5],
  phone: `+8801${String(800000000 + i * 1111).slice(0, 9)}`,
  zone: ZONES[i % ZONES.length],
  vehicle: VEHICLES[i % VEHICLES.length],
  orders: 10 + (i * 23) % 800,
  rating: parseFloat((3.8 + (i % 12) * 0.1).toFixed(1)),
  earnings: 5000 + (i * 890) % 80000,
  status: i % 10 === 0 ? 'pending' : i % 15 === 0 ? 'blocked' : i % 4 === 0 ? 'offline' : 'active',
  online: i % 4 !== 0,
}));

const TABS = [
  { id: 'all', label: 'All', count: DELIVERY_MEN.length },
  { id: 'active', label: 'Active', count: DELIVERY_MEN.filter(d => d.status === 'active').length },
  { id: 'offline', label: 'Offline', count: DELIVERY_MEN.filter(d => d.status === 'offline').length },
  { id: 'pending', label: 'Pending', count: DELIVERY_MEN.filter(d => d.status === 'pending').length },
  { id: 'blocked', label: 'Blocked', count: DELIVERY_MEN.filter(d => d.status === 'blocked').length },
];

const AVATAR_COLORS = ['#1aab50', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export function DeliveryClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = DELIVERY_MEN;
    if (activeTab !== 'all') list = list.filter(d => d.status === activeTab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.zone.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, search]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const columns: Column<DeliveryMan>[] = [
    {
      key: 'name',
      header: 'Delivery Man',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: AVATAR_COLORS[row.id.charCodeAt(3) % AVATAR_COLORS.length] }}>
              {getInitials(row.name)}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${row.online ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--foreground)]">{row.name}</p>
            <p className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
              <Phone className="w-3 h-3" />{row.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'zone',
      header: 'Zone',
      render: (_, row) => (
        <div className="text-[12px]">
          <p className="flex items-center gap-1 text-[var(--foreground)]"><MapPin className="w-3 h-3 text-[var(--primary)]" />{row.zone}</p>
          <p className="text-[var(--muted-foreground)]"><Bike className="w-3 h-3 inline mr-1" />{row.vehicle}</p>
        </div>
      ),
    },
    { key: 'orders', header: 'Orders', align: 'center', sortable: true, render: (v) => <span className="font-semibold text-[13px]">{(v as number).toLocaleString()}</span> },
    { key: 'rating', header: 'Rating', align: 'center', render: (v) => (
      <span className="inline-flex items-center gap-1 text-[12px] font-medium">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{v as number}
      </span>
    )},
    { key: 'status', header: 'Status', render: (v) => {
      const s = v as string;
      return <Badge variant={s === 'active' ? 'success' : s === 'pending' ? 'warning' : s === 'offline' ? 'muted' : 'danger'} dot>
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </Badge>;
    }},
    { key: 'id', header: 'Actions', align: 'center', render: () => (
      <div className="flex items-center justify-center gap-1">
        <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-green-50 hover:text-green-600 transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /></button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors"><XCircle className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Delivery Men"
        subtitle="Manage delivery personnel and their assignments"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Delivery Men' }]}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Delivery Man</Button>}
      />
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 pt-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} />
        </div>
        <FilterBar className="rounded-none border-none border-t border-[var(--border)] mt-0" searchValue={search} searchPlaceholder="Search delivery men..." onSearchChange={(v) => { setSearch(v); setPage(1); }} onExport={() => {}} />
        <DataTable columns={columns} data={paginated} keyField="id" className="rounded-none border-none" />
        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>
    </div>
  );
}

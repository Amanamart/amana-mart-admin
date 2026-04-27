'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/input';
import { formatCurrency, getTranslation } from '@/lib/utils';

import { useProducts, useCategories, useModules } from '@/hooks/useAdminDashboard';


export function ProductsClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const { data: productsData, isLoading } = useProducts({
    page,
    limit: PER_PAGE,
    search,
    categoryId: categoryFilter,
    moduleId,
    status: activeTab === 'all' ? undefined : activeTab,
  });

  const { data: categoriesData } = useCategories({ moduleId });
  const { data: modulesData } = useModules();

  const products = (productsData as any)?.products || [];
  const total = (productsData as any)?.total || 0;
  const categories = categoriesData || [];
  const modules = modulesData || [];

  const TABS = [
    { id: 'all', label: 'All Products', count: total },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'out_of_stock', label: 'Out of Stock' },
  ];

  const columns: Column<any>[] = [
    {
      key: 'name',

      header: 'Product',
      render: (_, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-gradient-to-br from-[var(--muted)] to-[var(--border)] flex items-center justify-center text-lg shrink-0 overflow-hidden relative">
            {row.image ? <Image src={row.image} alt="" fill className="object-cover" /> : '🛍️'}
          </div>

          <div>
            <p className="text-[13px] font-medium text-[var(--foreground)] leading-tight">{getTranslation(row.name, 'en')}</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">SKU: {row.sku || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (_, row: any) => <Badge variant="info">{getTranslation(row.category?.name, 'en') || 'Uncategorized'}</Badge> },
    { key: 'store', header: 'Store', render: (_, row: any) => <span className="text-[12px] text-[var(--muted-foreground)]">{row.store?.name || 'N/A'}</span> },

    {
      key: 'price',
      header: 'Price',
      align: 'right',
      sortable: true,
      render: (v) => <span className="font-semibold text-[13px]">{formatCurrency(v as number)}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      align: 'center',
      render: (v) => (
        <span
          className={`text-[13px] font-semibold ${(v as number) === 0 ? 'text-red-500' : (v as number) < 10 ? 'text-amber-500' : 'text-green-600'}`}
        >
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
          <Badge variant={s === 'active' ? 'success' : s === 'inactive' ? 'muted' : 'danger'} dot>
            {s === 'out_of_stock' ? 'Out of Stock' : s.charAt(0).toUpperCase() + s.slice(1)}
          </Badge>
        );
      },
    },
    ...(modules.find((m: any) => m.id === moduleId)?.type === 'pharmacy' ? [{
      key: 'requiresPrescription',
      header: 'Prescription',
      render: (v: any) => v ? <Badge variant="warning">Required</Badge> : <span className="text-[12px] text-[var(--muted-foreground)]">No</span>
    }] : []),
    ...(modules.find((m: any) => m.id === moduleId)?.type === 'food' ? [{
      key: 'cuisine',
      header: 'Cuisine',
      render: (_, row: any) => <span className="text-[12px]">{getTranslation(row.cuisine?.name, 'en') || 'N/A'}</span>
    }] : []),


    {
      key: 'id',
      header: 'Actions',
      align: 'center',
      render: (_, __: any) => (
        <div className="flex items-center justify-center gap-1">

          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-50 hover:text-blue-600 transition-colors" title="View">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Products"
        subtitle="Manage all marketplace products"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Products' }]}
        actions={
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Product
            </Button>
          </Link>
        }
      />

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 pt-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} />
        </div>

        <FilterBar
          className="rounded-none border-none border-t border-[var(--border)] mt-0"
          searchValue={search}
          searchPlaceholder="Search products, SKU, store..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          onExport={() => {}}
          filters={
            <div className="flex items-center gap-2">
              <Select
                options={modules.map((m: any) => ({ value: m.id, label: getTranslation(m.name, 'en') }))}
                placeholder="All Modules"
                value={moduleId}
                onChange={(e) => { setModuleId(e.target.value); setCategoryFilter(''); setPage(1); }}
                className="min-w-[150px]"
              />
              <Select
                options={categories.map((c: any) => ({ value: c.id, label: getTranslation(c.name, 'en') }))}
                placeholder="All Categories"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="min-w-[150px]"
                disabled={!moduleId}
              />
            </div>
          }
        />


        <DataTable
          columns={columns}
          data={products}
          loading={isLoading}
          keyField="id"
          className="rounded-none border-none"
        />


        <TablePagination page={page} perPage={PER_PAGE} total={total} onPageChange={setPage} />

      </div>
    </div>
  );
}

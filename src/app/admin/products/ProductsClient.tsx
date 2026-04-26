'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Star } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  category: string;
  store: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  rating: number;
  orders: number;
  sku: string;
}

const CATEGORIES = ['Grocery', 'Electronics', 'Fashion', 'Pharmacy', 'Home & Living', 'Sports'];
const STORES = ['Dhaka Fresh Market', 'BD Electronics', 'Amana Grocery', 'Fashion Hub BD', 'Dhaka Pharmacy'];

const PRODUCTS: Product[] = Array.from({ length: 80 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: [
    'Organic Basmati Rice 5kg',
    'Samsung Galaxy A54',
    'Cotton Kurti Set',
    'Paracetamol 500mg x24',
    'LED Smart TV 43"',
    'Mango Pickle 500g',
    'Wireless Earbuds Pro',
    'Linen Bedsheet Set',
    'Vitamin C 1000mg',
    'Fresh Hilsa Fish 1kg',
  ][i % 10],
  category: CATEGORIES[i % CATEGORIES.length],
  store: STORES[i % STORES.length],
  price: 200 + (i * 223 + 500) % 50000,
  stock: i % 7 === 0 ? 0 : 5 + (i * 13) % 200,
  status: i % 7 === 0 ? 'out_of_stock' : i % 5 === 0 ? 'inactive' : 'active',
  rating: parseFloat((3.8 + (i % 12) * 0.1).toFixed(1)),
  orders: (i * 37 + 5) % 500,
  sku: `SKU-${String(10000 + i).slice(1)}`,
}));

const TABS = [
  { id: 'all', label: 'All Products', count: PRODUCTS.length },
  { id: 'active', label: 'Active', count: PRODUCTS.filter((p) => p.status === 'active').length },
  { id: 'inactive', label: 'Inactive', count: PRODUCTS.filter((p) => p.status === 'inactive').length },
  { id: 'out_of_stock', label: 'Out of Stock', count: PRODUCTS.filter((p) => p.status === 'out_of_stock').length },
];

export function ProductsClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeTab !== 'all') list = list.filter((p) => p.status === activeTab);
    if (categoryFilter) list = list.filter((p) => p.category === categoryFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.store.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, search, categoryFilter]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-gradient-to-br from-[var(--muted)] to-[var(--border)] flex items-center justify-center text-lg shrink-0">
            🛍️
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--foreground)] leading-tight">{row.name}</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">SKU: {row.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (v) => <Badge variant="info">{v as string}</Badge> },
    { key: 'store', header: 'Store', render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{v as string}</span> },
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
          <Badge variant={s === 'active' ? 'success' : s === 'inactive' ? 'muted' : 'danger'} dot>
            {s === 'out_of_stock' ? 'Out of Stock' : s.charAt(0).toUpperCase() + s.slice(1)}
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
            <Select
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              placeholder="All Categories"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="min-w-[150px]"
            />
          }
        />

        <DataTable
          columns={columns}
          data={paginated}
          keyField="id"
          className="rounded-none border-none"
        />

        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>
    </div>
  );
}

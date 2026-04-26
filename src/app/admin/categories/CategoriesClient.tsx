'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, FolderOpen, Package } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/input';

interface Category {
  id: string;
  name: string;
  module: string;
  products: number;
  subcategories: number;
  status: 'active' | 'inactive';
  order: number;
  children?: Category[];
}

const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Fruits & Vegetables', module: 'Grocery', products: 234, subcategories: 8, status: 'active', order: 1, children: [
    { id: 'c1-1', name: 'Fresh Fruits', module: 'Grocery', products: 89, subcategories: 0, status: 'active', order: 1 },
    { id: 'c1-2', name: 'Fresh Vegetables', module: 'Grocery', products: 112, subcategories: 0, status: 'active', order: 2 },
    { id: 'c1-3', name: 'Exotic Produce', module: 'Grocery', products: 33, subcategories: 0, status: 'active', order: 3 },
  ]},
  { id: 'c2', name: 'Dairy & Eggs', module: 'Grocery', products: 78, subcategories: 4, status: 'active', order: 2, children: [
    { id: 'c2-1', name: 'Milk', module: 'Grocery', products: 22, subcategories: 0, status: 'active', order: 1 },
    { id: 'c2-2', name: 'Eggs', module: 'Grocery', products: 15, subcategories: 0, status: 'active', order: 2 },
  ]},
  { id: 'c3', name: 'Medicines', module: 'Pharmacy', products: 543, subcategories: 12, status: 'active', order: 1, children: [
    { id: 'c3-1', name: 'OTC Medicines', module: 'Pharmacy', products: 234, subcategories: 0, status: 'active', order: 1 },
    { id: 'c3-2', name: 'Prescription', module: 'Pharmacy', products: 189, subcategories: 0, status: 'active', order: 2 },
  ]},
  { id: 'c4', name: 'Mobile Phones', module: 'eCommerce', products: 89, subcategories: 3, status: 'active', order: 1 },
  { id: 'c5', name: 'Clothing', module: 'eCommerce', products: 312, subcategories: 8, status: 'active', order: 2 },
  { id: 'c6', name: 'Fast Food', module: 'Food', products: 145, subcategories: 5, status: 'active', order: 1 },
  { id: 'c7', name: 'Old Items', module: 'Grocery', products: 3, subcategories: 0, status: 'inactive', order: 99 },
];

const MODULES = ['All', 'Grocery', 'Pharmacy', 'eCommerce', 'Food', 'Parcel'];

const TABS = [
  { id: 'all', label: 'All Categories', count: CATEGORIES.length },
  { id: 'active', label: 'Active', count: CATEGORIES.filter(c => c.status === 'active').length },
  { id: 'inactive', label: 'Inactive', count: CATEGORIES.filter(c => c.status === 'inactive').length },
];

const MODULE_COLORS: Record<string, string> = {
  'Grocery': '#1aab50', 'Pharmacy': '#ef4444', 'eCommerce': '#3b82f6',
  'Food': '#f59e0b', 'Parcel': '#8b5cf6',
};

function CategoryRow({ cat, depth = 0 }: { cat: Category; depth?: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;

  return (
    <>
      <tr className="hover:bg-[#fafafa] transition-colors border-b border-[var(--border)]">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
            {hasChildren ? (
              <button onClick={() => setExpanded(!expanded)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <div className="w-8 h-8 rounded-[var(--radius)] flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${MODULE_COLORS[cat.module] || '#6b7280'}15` }}>
              {hasChildren ? <FolderOpen className="w-4 h-4" style={{ color: MODULE_COLORS[cat.module] || '#6b7280' }} />
                : <Package className="w-4 h-4" style={{ color: MODULE_COLORS[cat.module] || '#6b7280' }} />}
            </div>
            <span className="text-[13px] font-medium text-[var(--foreground)]">{cat.name}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <Badge variant="info" style={{ backgroundColor: `${MODULE_COLORS[cat.module]}15`, color: MODULE_COLORS[cat.module], borderColor: `${MODULE_COLORS[cat.module]}30` }}>
            {cat.module}
          </Badge>
        </td>
        <td className="px-4 py-3 text-center text-[13px] font-medium">{cat.products}</td>
        <td className="px-4 py-3 text-center text-[13px] text-[var(--muted-foreground)]">{cat.subcategories}</td>
        <td className="px-4 py-3 text-center">{cat.order}</td>
        <td className="px-4 py-3">
          <Badge variant={cat.status === 'active' ? 'success' : 'muted'} dot>
            {cat.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-1">
            <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-amber-50 hover:text-amber-600 transition-colors">
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
      {expanded && cat.children?.map((child) => (
        <CategoryRow key={child.id} cat={child} depth={depth + 1} />
      ))}
    </>
  );
}

export function CategoriesClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = CATEGORIES;
    if (activeTab !== 'all') list = list.filter(c => c.status === activeTab);
    if (moduleFilter) list = list.filter(c => c.module === moduleFilter);
    if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [activeTab, search, moduleFilter]);

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Categories"
        subtitle="Manage product categories and subcategories"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Categories' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Add Category
          </Button>
        }
      />

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 pt-4">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <FilterBar
          className="rounded-none border-none border-t border-[var(--border)] mt-0"
          searchValue={search}
          searchPlaceholder="Search categories..."
          onSearchChange={setSearch}
          onExport={() => {}}
          filters={
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="h-9 rounded-[var(--radius)] border border-[var(--border)] bg-white text-sm text-[var(--foreground)] px-3 focus:outline-none focus:border-[var(--primary)] min-w-[140px]"
            >
              <option value="">All Modules</option>
              {MODULES.slice(1).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          }
        />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8f9fb] border-b border-[var(--border)]">
              {['Category Name', 'Module', 'Products', 'Subcategories', 'Order', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(cat => <CategoryRow key={cat.id} cat={cat} />)}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[13px] text-[var(--muted-foreground)]">No categories found</div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Category"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Save Category</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Category Name" required placeholder="e.g., Fruits & Vegetables" />
          <Input label="Category Name (Bengali)" placeholder="ফলমূল ও শাকসবজি" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Module" required options={MODULES.slice(1).map(m => ({ value: m, label: m }))} />
            <Select label="Parent Category" options={[{ value: '', label: '— Root Category —' }, ...CATEGORIES.filter(c => c.status === 'active').map(c => ({ value: c.id, label: c.name }))]} />
          </div>
          <Input label="Display Order" type="number" placeholder="1" />
          <div className="border-2 border-dashed border-[var(--border)] rounded-[var(--radius-md)] p-6 text-center cursor-pointer hover:border-[var(--primary)] transition-colors">
            <p className="text-[13px] font-medium text-[var(--muted-foreground)]">Upload Category Image</p>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-1">PNG, JPG · 300×300px recommended</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

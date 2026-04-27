import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, FolderOpen, Package } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/input';
import { useCategories, useModules } from '@/hooks/useAdminDashboard';
import { getTranslation } from '@/lib/utils';


const TABS = [
  { id: 'all', label: 'All Categories' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
];


const MODULE_COLORS: Record<string, string> = {
  'Grocery': '#1aab50', 'Pharmacy': '#ef4444', 'eCommerce': '#3b82f6',
  'Food': '#f59e0b', 'Parcel': '#8b5cf6',
};

function CategoryRow({ cat, depth = 0 }: { cat: any; depth?: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;
  const moduleName = getTranslation(cat.module?.name, 'en') || 'Default';

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
            <div className="w-8 h-8 rounded-[var(--radius)] flex items-center justify-center shrink-0 overflow-hidden relative"
              style={{ backgroundColor: `${MODULE_COLORS[moduleName] || '#6b7280'}15` }}>
              {cat.image ? (
                <Image src={cat.image} alt="" fill className="object-cover" />
              ) : hasChildren ? (
                <FolderOpen className="w-4 h-4" style={{ color: MODULE_COLORS[moduleName] || '#6b7280' }} />
              ) : (
                <Package className="w-4 h-4" style={{ color: MODULE_COLORS[moduleName] || '#6b7280' }} />
              )}
            </div>
            <span className="text-[13px] font-medium text-[var(--foreground)]">{getTranslation(cat.name, 'en')}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <Badge variant="info" style={{ backgroundColor: `${MODULE_COLORS[moduleName]}15`, color: MODULE_COLORS[moduleName], borderColor: `${MODULE_COLORS[moduleName]}30` }}>
            {moduleName}
          </Badge>
        </td>
        <td className="px-4 py-3 text-center text-[13px] font-medium">{cat._count?.products || 0}</td>
        <td className="px-4 py-3 text-center text-[13px] text-[var(--muted-foreground)]">{cat.children?.length || 0}</td>
        <td className="px-4 py-3 text-center">{cat.priority || 0}</td>
        <td className="px-4 py-3">
          <Badge variant={cat.status ? 'success' : 'muted'} dot>
            {cat.status ? 'Active' : 'Inactive'}
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
      {expanded && cat.children?.map((child: any) => (
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

  const { data: categoriesData, isLoading } = useCategories({
    moduleId: moduleFilter,
  });
  const { data: modulesData } = useModules();

  const categories = categoriesData || [];
  const modules = modulesData || [];

  const filtered = useMemo(() => {
    let list = categories;
    if (activeTab !== 'all') {
      const status = activeTab === 'active';
      list = list.filter((c: any) => c.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c: any) => getTranslation(c.name, 'en').toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, search, categories]);

  const TABS = [
    { id: 'all', label: 'All Categories', count: categories.length },
    { id: 'active', label: 'Active', count: categories.filter((c: any) => c.status).length },
    { id: 'inactive', label: 'Inactive', count: categories.filter((c: any) => !c.status).length },
  ];


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
            <Select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              options={[
                { value: '', label: 'All Modules' },
                ...modules.map((m: any) => ({ value: m.id, label: getTranslation(m.name, 'en') }))
              ]}
              className="min-w-[150px]"
            />
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
            {isLoading ? (
              <tr><td colSpan={7} className="py-12 text-center text-[var(--muted-foreground)]">Loading categories...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-[var(--muted-foreground)]">No categories found</td></tr>
            ) : (
              filtered.map((cat: any) => <CategoryRow key={cat.id} cat={cat} />)
            )}
          </tbody>
        </table>

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
            <Select label="Module" required options={modules.map((m: any) => ({ value: m.id, label: getTranslation(m.name, 'en') }))} />
            <Select label="Parent Category" options={[{ value: '', label: '— Root Category —' }, ...categories.filter((c: any) => c.status).map((c: any) => ({ value: c.id, label: getTranslation(c.name, 'en') }))]} />
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

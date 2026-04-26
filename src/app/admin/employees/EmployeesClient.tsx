'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Shield, Mail, Phone } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/input';
import { formatDate, getInitials } from '@/lib/utils';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const ROLES = ['Super Admin', 'Ops Admin', 'Finance Admin', 'Support Admin', 'Catalog Admin'];
const EMPLOYEES: Employee[] = Array.from({ length: 13 }, (_, i) => ({
  id: `emp-${i + 1}`,
  name: ['Abdur Rahman', 'Fatema Khatun', 'Mahbub Alam', 'Sumaiya Haque', 'Tanvir Ahmed', 'Nusrat Jahan'][i % 6],
  email: `employee${i + 1}@amanamart.com`,
  phone: `+8801${String(900000000 + i * 1234).slice(0, 9)}`,
  role: ROLES[i % ROLES.length],
  status: i === 4 ? 'inactive' : 'active',
  joinDate: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
}));

const AVATAR_COLORS = ['#005555', '#1aab50', '#3b82f6', '#8b5cf6', '#f59e0b'];

export function EmployeesClient() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    if (!search) return EMPLOYEES;
    const q = search.toLowerCase();
    return EMPLOYEES.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.role.toLowerCase().includes(q));
  }, [search]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const columns: Column<Employee>[] = [
    { key: 'name', header: 'Employee', render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: AVATAR_COLORS[row.id.charCodeAt(4) % AVATAR_COLORS.length] }}>
          {getInitials(row.name)}
        </div>
        <div>
          <p className="text-[13px] font-medium text-[var(--foreground)]">{row.name}</p>
          <p className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1"><Mail className="w-3 h-3" />{row.email}</p>
        </div>
      </div>
    )},
    { key: 'phone', header: 'Phone', render: (v) => <span className="text-[12px] flex items-center gap-1"><Phone className="w-3 h-3 text-[var(--muted-foreground)]" />{v as string}</span> },
    { key: 'role', header: 'Role', render: (v) => (
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--secondary)]">
        <Shield className="w-3.5 h-3.5" />{v as string}
      </div>
    )},
    { key: 'joinDate', header: 'Joined', render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{formatDate(v as string)}</span> },
    { key: 'status', header: 'Status', render: (v) => <Badge variant={v === 'active' ? 'success' : 'muted'} dot>{(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}</Badge> },
    { key: 'id', header: 'Actions', align: 'center', render: () => (
      <div className="flex items-center justify-center gap-1">
        <button className="text-[11px] px-2 py-1 rounded border border-[var(--border)] text-[var(--muted-foreground)] hover:border-amber-400 hover:text-amber-600 transition-colors">Edit</button>
        <button className="text-[11px] px-2 py-1 rounded border border-[var(--border)] text-[var(--muted-foreground)] hover:border-red-400 hover:text-red-500 transition-colors">Remove</button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Employee List"
        subtitle="Manage admin staff and their role assignments"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'User Management' }, { label: 'Employees' }]}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>Add Employee</Button>}
      />
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <FilterBar searchValue={search} searchPlaceholder="Search employees..." onSearchChange={(v) => { setSearch(v); setPage(1); }} />
        <DataTable columns={columns} data={paginated} keyField="id" className="rounded-t-none border-t-0" />
        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Employee" size="md"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => setModalOpen(false)}>Add Employee</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" required placeholder="First name" />
            <Input label="Last Name" required placeholder="Last name" />
          </div>
          <Input label="Email" type="email" required placeholder="employee@amanamart.com" />
          <Input label="Phone" placeholder="+880 1XXX-XXXXXX" />
          <Select label="Role" required options={ROLES.map(r => ({ value: r, label: r }))} />
          <Input label="Password" type="password" required placeholder="Temporary password" />
        </div>
      </Modal>
    </div>
  );
}

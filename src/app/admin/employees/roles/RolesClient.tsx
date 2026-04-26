'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';

interface Permission { id: string; label: string; key: string; }
interface PermissionGroup { group: string; permissions: Permission[]; }
interface Role {
  id: string;
  name: string;
  description: string;
  employees: number;
  color: string;
  permissions: string[];
  system?: boolean;
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  { group: 'Dashboard', permissions: [{ id: 'p1', label: 'View Dashboard', key: 'dashboard.view' }] },
  { group: 'Orders', permissions: [{ id: 'p2', label: 'View Orders', key: 'orders.view' }, { id: 'p3', label: 'Update Status', key: 'orders.update_status' }, { id: 'p4', label: 'Approve Refunds', key: 'orders.refund' }] },
  { group: 'Products', permissions: [{ id: 'p5', label: 'View Products', key: 'products.view' }, { id: 'p6', label: 'Create Products', key: 'products.create' }, { id: 'p7', label: 'Edit Products', key: 'products.edit' }, { id: 'p8', label: 'Delete Products', key: 'products.delete' }] },
  { group: 'Stores', permissions: [{ id: 'p9', label: 'View Stores', key: 'stores.view' }, { id: 'p10', label: 'Approve Stores', key: 'stores.approve' }, { id: 'p11', label: 'Block Stores', key: 'stores.block' }] },
  { group: 'Finance', permissions: [{ id: 'p12', label: 'View Transactions', key: 'finance.view' }, { id: 'p13', label: 'Approve Payouts', key: 'finance.payouts' }] },
  { group: 'Customers', permissions: [{ id: 'p14', label: 'View Customers', key: 'customers.view' }, { id: 'p15', label: 'Block Customers', key: 'customers.block' }] },
  { group: 'Settings', permissions: [{ id: 'p16', label: 'View Settings', key: 'settings.view' }, { id: 'p17', label: 'Edit Settings', key: 'settings.edit' }] },
  { group: 'Reports', permissions: [{ id: 'p18', label: 'View Reports', key: 'reports.view' }, { id: 'p19', label: 'Export Reports', key: 'reports.export' }] },
];

const ROLES: Role[] = [
  { id: 'r1', name: 'Super Admin', description: 'Full access to all features and settings', employees: 1, color: '#005555', permissions: PERMISSION_GROUPS.flatMap(g => g.permissions.map(p => p.key)), system: true },
  { id: 'r2', name: 'Ops Admin', description: 'Manage orders, stores, and deliveries', employees: 3, color: '#1aab50', permissions: ['dashboard.view', 'orders.view', 'orders.update_status', 'stores.view', 'stores.approve', 'customers.view', 'reports.view'] },
  { id: 'r3', name: 'Finance Admin', description: 'Handle transactions and payouts', employees: 2, color: '#3b82f6', permissions: ['dashboard.view', 'finance.view', 'finance.payouts', 'reports.view', 'reports.export'] },
  { id: 'r4', name: 'Support Admin', description: 'Customer support and issue resolution', employees: 5, color: '#f59e0b', permissions: ['dashboard.view', 'orders.view', 'customers.view', 'reports.view'] },
  { id: 'r5', name: 'Catalog Admin', description: 'Manage products and categories', employees: 2, color: '#8b5cf6', permissions: ['dashboard.view', 'products.view', 'products.create', 'products.edit', 'products.delete'] },
];

export function RolesClient() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const allPerms = PERMISSION_GROUPS.flatMap(g => g.permissions.map(p => p.key));

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Employee Roles"
        subtitle="Define roles and permissions for admin staff"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'User Management' }, { label: 'Roles' }]}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>Add Role</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Role List */}
        <div className="space-y-3">
          {ROLES.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`bg-white rounded-[var(--radius-lg)] border p-4 cursor-pointer hover:shadow-[var(--shadow-md)] transition-all ${selectedRole?.id === role.id ? 'border-[var(--primary)] shadow-[var(--shadow-md)]' : 'border-[var(--border)]'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-[var(--radius)] flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: role.color }}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--foreground)]">{role.name}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">{role.employees} employees</p>
                  </div>
                </div>
                {role.system && <Badge variant="info">System</Badge>}
              </div>
              <p className="text-[12px] text-[var(--muted-foreground)]">{role.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                <span className="text-[11px] text-[var(--muted-foreground)]">{role.permissions.length} / {allPerms.length} permissions</span>
                <div className="h-1.5 w-24 bg-[var(--muted)] rounded-full">
                  <div className="h-1.5 rounded-full" style={{ width: `${(role.permissions.length / allPerms.length) * 100}%`, backgroundColor: role.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Permission Detail */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[var(--radius)] flex items-center justify-center text-white" style={{ backgroundColor: selectedRole.color }}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[var(--foreground)]">{selectedRole.name}</p>
                    <p className="text-[12px] text-[var(--muted-foreground)]">{selectedRole.description}</p>
                  </div>
                </div>
                {!selectedRole.system && (
                  <div className="flex items-center gap-2">
                    <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-amber-50 hover:text-amber-600 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
              <div className="divide-y divide-[var(--border)]">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.group} className="px-5 py-3">
                    <p className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">{group.group}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.permissions.map((perm) => {
                        const has = selectedRole.permissions.includes(perm.key);
                        return (
                          <div key={perm.id} className={`inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full border ${has ? 'bg-[var(--primary-light)] text-[var(--primary-dark)] border-[var(--primary)]/20' : 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]'}`}>
                            {has && <Check className="w-3 h-3" />}
                            {perm.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] h-full flex items-center justify-center">
              <div className="text-center py-16">
                <Shield className="w-12 h-12 text-[var(--border)] mx-auto mb-3" />
                <p className="text-[14px] font-medium text-[var(--muted-foreground)]">Select a role to view permissions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Role" size="sm"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => setModalOpen(false)}>Create Role</Button></>}>
        <div className="space-y-4">
          <Input label="Role Name" required placeholder="e.g., Marketing Admin" />
          <Input label="Description" placeholder="Describe what this role can do" />
        </div>
      </Modal>
    </div>
  );
}

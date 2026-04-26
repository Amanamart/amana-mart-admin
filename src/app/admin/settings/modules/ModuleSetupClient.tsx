'use client';

import React, { useState } from 'react';
import { Plus, Search, Layers, Settings, ShoppingBasket, Pill, ShoppingBag, Truck, UtensilsCrossed, CheckCircle2, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';

const MOCK_MODULES = [
  { id: '1', name: 'Grocery', type: 'grocery', icon: '🛒', stores: 45, status: 'active', color: '#1aab50', description: 'Fresh groceries' },
  { id: '2', name: 'Pharmacy', type: 'pharmacy', icon: '💊', stores: 28, status: 'active', color: '#ef4444', description: 'Medicines' },
  { id: '3', name: 'Food', type: 'food', icon: '🍕', stores: 86, status: 'active', color: '#f59e0b', description: 'Restaurant food' },
  { id: '4', name: 'Shop', type: 'shop', icon: '🛍️', stores: 112, status: 'active', color: '#3b82f6', description: 'General shopping' },
  { id: '5', name: 'Courier', type: 'parcel', icon: '📦', stores: 0, status: 'active', color: '#f97316', description: 'Parcel delivery' },
];

export function ModuleSetupClient() {
  const [modules, setModules] = useState(MOCK_MODULES);
  const [search, setSearch] = useState('');

  const filteredModules = modules.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleModule = (id: string) => {
    setModules(modules.map(m => 
      m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
    ));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Module Setup"
        subtitle="Manage and configure your marketplace business modules"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: 'Modules' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Module
          </Button>
        }
      />

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search modules..."
            className="w-full h-9 pl-9 pr-4 rounded-[var(--radius)] border border-[var(--border)] bg-white text-sm focus:outline-none focus:border-[var(--primary)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[var(--muted-foreground)] font-medium">
          <Layers className="w-4 h-4" />
          <span>{modules.filter(m => m.status === 'active').length} Active Modules</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((module) => (
          <Card key={module.id} padding="none" className="overflow-hidden group hover:shadow-[var(--shadow-md)] transition-all duration-300">
            <div className="p-5 flex items-start justify-between">
              <div className="flex gap-4">
                <div 
                  className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center text-xl text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: module.color }}
                >
                  {module.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[var(--foreground)]">{module.name}</h3>
                  <p className="text-[12px] text-[var(--muted-foreground)] capitalize">{module.type} Module</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {module.stores} Stores
                    </span>
                  </div>
                </div>
              </div>
              <StatusBadge status={module.status as any} />
            </div>
            
            <div className="px-5 py-3 bg-[#fafafa] border-t border-[var(--border)] flex items-center justify-between">
              <button 
                onClick={() => toggleModule(module.id)}
                className={`text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
                  module.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'
                }`}
              >
                {module.status === 'active' ? (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Disable Module
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Enable Module
                  </>
                )}
              </button>
              
              <Button variant="ghost" size="sm" className="h-8 px-2" leftIcon={<Settings className="w-3.5 h-3.5" />}>
                Configure
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-12 text-center">
          <Layers className="w-12 h-12 text-[var(--border)] mx-auto mb-4" />
          <h3 className="text-[16px] font-semibold text-[var(--foreground)] mb-1">No modules found</h3>
          <p className="text-[13px] text-[var(--muted-foreground)]">Try adjusting your search terms or add a new module.</p>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';

import { useZones, useCreateZone } from '@/hooks/useZones';

export function ZonesClient() {
  const { data: zonesData, isLoading } = useZones();
  const createZoneMutation = useCreateZone();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', area: '' });

  const zones = zonesData || [];

  const filteredZones = zones.filter((z: any) => 
    z.name.toLowerCase().includes(search.toLowerCase()) || 
    (z.area && z.area.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddZone = async () => {
    if (!newZone.name || !newZone.area) return;
    try {
      await createZoneMutation.mutateAsync({
        name: newZone.name,
        area: newZone.area,
        status: 'active'
      });
      setNewZone({ name: '', area: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create zone:', error);
    }
  };

  const handleDeleteZone = (id: string) => {
    if (confirm('Are you sure you want to delete this zone?')) {
      // TODO: Implement delete API call
    }
  };

  if (isLoading) return <div className="p-8 text-center text-[var(--muted-foreground)]">Loading zones...</div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Zone Setup"
        subtitle="Manage business zones and operational areas"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: 'Zones' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add New Zone
          </Button>
        }
      />

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--card)]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search zones..."
              className="w-full h-9 pl-9 pr-4 rounded-[var(--radius)] border border-[var(--border)] bg-white text-sm focus:outline-none focus:border-[var(--primary)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[var(--muted-foreground)]">
            <Activity className="w-3.5 h-3.5" />
            <span>{zones.length} Total Zones</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[var(--border)]">
                <th className="px-5 py-3 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase">SL</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase">Zone Name</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase">Operational Area</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase">Stores</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[13px]">
              {filteredZones.map((zone: any, i: number) => (
                <tr key={zone.id} className="hover:bg-[#fcfcfc] transition-colors">
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">{i + 1}</td>
                  <td className="px-5 py-4 font-medium text-[var(--foreground)]">{zone.name}</td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)] max-w-xs truncate">{zone.area}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                      {zone.stores} Stores
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={zone.status as any} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" 
                        title="Delete"
                        onClick={() => handleDeleteZone(zone.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredZones.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[var(--muted-foreground)]">
                    No zones found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Zone Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Zone"
        subtitle="Create a new geographical zone for operations"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleAddZone}>Create Zone</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Input
            label="Zone Name"
            placeholder="e.g. Dhaka City Central"
            value={newZone.name}
            onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
            required
          />
          <Textarea
            label="Operational Areas"
            placeholder="e.g. Banani, Gulshan 1, Gulshan 2..."
            value={newZone.area}
            onChange={(e) => setNewZone({ ...newZone, area: e.target.value })}
            required
            rows={4}
            hint="Enter comma-separated areas or neighborhoods"
          />
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-[var(--radius)] flex flex-col items-center justify-center gap-2 aspect-video text-[var(--muted-foreground)]">
            <MapPin className="w-6 h-6 opacity-40" />
            <p className="text-[12px]">Map Integration Placeholder</p>
            <p className="text-[10px] opacity-70">(Area polygon selection will be available here)</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

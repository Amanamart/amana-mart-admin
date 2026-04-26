'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/input';

interface Banner {
  id: string;
  title: string;
  zone: string;
  type: string;
  position: number;
  active: boolean;
  createdAt: string;
}

const BANNERS: Banner[] = Array.from({ length: 12 }, (_, i) => ({
  id: `banner-${i + 1}`,
  title: ['Eid Sale - Up to 70% Off', 'New Arrivals - Fresh Collection', 'Free Delivery Over ৳500', 'Flash Deal - Today Only', 'Ramadan Special Offers'][i % 5],
  zone: ['Dhaka North', 'Dhaka South', 'Chattogram', 'All Zones'][i % 4],
  type: ['Main Banner', 'Promotional', 'Side Banner', 'Pop-up'][i % 4],
  position: i + 1,
  active: i % 3 !== 0,
  createdAt: new Date(2026, 3, 15 - i).toISOString(),
}));

export function BannersClient() {
  const [banners, setBanners] = useState(BANNERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', zone: 'All Zones', type: 'Main Banner' });

  const toggleActive = (id: string) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  };

  const BANNER_COLORS = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-red-600',
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Banners"
        subtitle="Manage promotional banners displayed on the storefront"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Promotions' }, { label: 'Banners' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Add Banner
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner, i) => (
          <div key={banner.id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] overflow-hidden">
            {/* Banner preview */}
            <div className={`bg-gradient-to-r ${BANNER_COLORS[i % BANNER_COLORS.length]} h-28 flex items-center justify-center px-4`}>
              <p className="text-white font-bold text-center text-sm leading-tight">{banner.title}</p>
            </div>
            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-[13px] font-semibold text-[var(--foreground)]">{banner.title}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{banner.type} · {banner.zone}</p>
                </div>
                <Badge variant={banner.active ? 'success' : 'muted'} dot>
                  {banner.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  onClick={() => toggleActive(banner.id)}
                  className="flex-1 h-8 rounded-[var(--radius)] border border-[var(--border)] text-[12px] font-medium text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-1.5"
                >
                  {banner.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {banner.active ? 'Deactivate' : 'Activate'}
                </button>
                <button className="w-8 h-8 rounded-[var(--radius)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="w-8 h-8 rounded-[var(--radius)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Banner Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Banner"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Save Banner</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Banner Title"
            required
            placeholder="e.g., Eid Sale - 70% Off"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Select
            label="Zone"
            required
            options={[
              { value: 'All Zones', label: 'All Zones' },
              { value: 'Dhaka North', label: 'Dhaka North' },
              { value: 'Dhaka South', label: 'Dhaka South' },
              { value: 'Chattogram', label: 'Chattogram' },
            ]}
            value={form.zone}
            onChange={(e) => setForm({ ...form, zone: e.target.value })}
          />
          <Select
            label="Banner Type"
            required
            options={[
              { value: 'Main Banner', label: 'Main Banner' },
              { value: 'Promotional', label: 'Promotional' },
              { value: 'Side Banner', label: 'Side Banner' },
              { value: 'Pop-up', label: 'Pop-up' },
            ]}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <div className="border-2 border-dashed border-[var(--border)] rounded-[var(--radius-md)] p-8 text-center cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors">
            <p className="text-[13px] font-medium text-[var(--muted-foreground)]">Click to upload banner image</p>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-1">PNG, JPG up to 5MB · Recommended: 1200×400px</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';

interface AttributeValue { id: string; value: string; }
interface Attribute {
  id: string;
  name: string;
  type: 'text' | 'color' | 'size' | 'number';
  values: AttributeValue[];
  products: number;
  status: 'active' | 'inactive';
}

const ATTRIBUTES: Attribute[] = [
  { id: 'a1', name: 'Color', type: 'color', values: [{ id: 'v1', value: 'Red' }, { id: 'v2', value: 'Blue' }, { id: 'v3', value: 'Green' }, { id: 'v4', value: 'Black' }, { id: 'v5', value: 'White' }], products: 234, status: 'active' },
  { id: 'a2', name: 'Size', type: 'size', values: [{ id: 'v6', value: 'XS' }, { id: 'v7', value: 'S' }, { id: 'v8', value: 'M' }, { id: 'v9', value: 'L' }, { id: 'v10', value: 'XL' }, { id: 'v11', value: 'XXL' }], products: 189, status: 'active' },
  { id: 'a3', name: 'Weight', type: 'number', values: [{ id: 'v12', value: '250g' }, { id: 'v13', value: '500g' }, { id: 'v14', value: '1kg' }, { id: 'v15', value: '2kg' }, { id: 'v16', value: '5kg' }], products: 145, status: 'active' },
  { id: 'a4', name: 'Volume', type: 'number', values: [{ id: 'v17', value: '250ml' }, { id: 'v18', value: '500ml' }, { id: 'v19', value: '1L' }, { id: 'v20', value: '2L' }], products: 89, status: 'active' },
  { id: 'a5', name: 'Material', type: 'text', values: [{ id: 'v21', value: 'Cotton' }, { id: 'v22', value: 'Polyester' }, { id: 'v23', value: 'Linen' }, { id: 'v24', value: 'Silk' }], products: 112, status: 'active' },
];

const TYPE_COLORS: Record<string, string> = { text: '#6b7280', color: '#ef4444', size: '#3b82f6', number: '#8b5cf6' };

export function AttributesClient() {
  const [expanded, setExpanded] = useState<string | null>('a1');
  const [modalOpen, setModalOpen] = useState(false);
  const [newValue, setNewValue] = useState('');

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Attributes"
        subtitle="Define product attributes like color, size, and weight"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Attributes' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Add Attribute
          </Button>
        }
      />

      <div className="space-y-3">
        {ATTRIBUTES.map((attr) => (
          <div key={attr.id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors"
              onClick={() => setExpanded(expanded === attr.id ? null : attr.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius)] flex items-center justify-center"
                  style={{ backgroundColor: `${TYPE_COLORS[attr.type]}15` }}>
                  <Tag className="w-4 h-4" style={{ color: TYPE_COLORS[attr.type] }} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--foreground)]">{attr.name}</p>
                  <p className="text-[12px] text-[var(--muted-foreground)]">
                    {attr.values.length} values · {attr.products} products
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="info">{attr.type}</Badge>
                <Badge variant={attr.status === 'active' ? 'success' : 'muted'} dot>
                  {attr.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-amber-50 hover:text-amber-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expanded === attr.id ? <ChevronUp className="w-4 h-4 text-[var(--muted-foreground)]" /> : <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />}
              </div>
            </div>

            {expanded === attr.id && (
              <div className="border-t border-[var(--border)] px-5 py-4 bg-[#fafafa]">
                <p className="text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-3">Values</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {attr.values.map((v) => (
                    <div key={v.id} className="flex items-center gap-1.5 bg-white border border-[var(--border)] rounded-full px-3 py-1 group">
                      {attr.type === 'color' && (
                        <div className="w-3 h-3 rounded-full border border-[var(--border)]"
                          style={{ backgroundColor: v.value.toLowerCase() === 'black' ? '#000' : v.value.toLowerCase() === 'white' ? '#fff' : v.value.toLowerCase() === 'red' ? '#ef4444' : v.value.toLowerCase() === 'blue' ? '#3b82f6' : '#22c55e' }} />
                      )}
                      <span className="text-[12px] font-medium">{v.value}</span>
                      <button className="w-3.5 h-3.5 rounded-full text-[var(--muted-foreground)] hover:text-red-500 hidden group-hover:block transition-colors">×</button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={`Add new ${attr.name.toLowerCase()} value...`}
                    className="flex-1 h-8 px-3 rounded-[var(--radius)] border border-[var(--border)] text-[12px] focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    onClick={() => setNewValue('')}
                    className="h-8 px-3 rounded-[var(--radius)] bg-[var(--primary)] text-white text-[12px] font-medium hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Attribute"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Save Attribute</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Attribute Name" required placeholder="e.g., Color, Size, Weight" />
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[var(--foreground)]">Attribute Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: 'text', label: '📝 Text' }, { value: 'color', label: '🎨 Color' }, { value: 'size', label: '📐 Size' }, { value: 'number', label: '🔢 Number' }].map(t => (
                <label key={t.value} className="flex items-center gap-2 p-2.5 border border-[var(--border)] rounded-[var(--radius)] cursor-pointer hover:border-[var(--primary)] transition-colors text-[13px]">
                  <input type="radio" name="type" value={t.value} className="accent-[var(--primary)]" />
                  {t.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

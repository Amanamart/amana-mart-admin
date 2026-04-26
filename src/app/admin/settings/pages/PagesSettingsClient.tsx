'use client';

import React, { useState } from 'react';
import { Save, Info, ShieldCheck, FileText, RefreshCcw, Truck } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/Tabs';
import { Textarea } from '@/components/ui/input';

const TABS = [
  { id: 'about', label: 'About Us', icon: <Info className="w-3.5 h-3.5" /> },
  { id: 'terms', label: 'Terms & Conditions', icon: <FileText className="w-3.5 h-3.5" /> },
  { id: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: 'refund', label: 'Refund Policy', icon: <RefreshCcw className="w-3.5 h-3.5" /> },
  { id: 'shipping', label: 'Shipping Policy', icon: <Truck className="w-3.5 h-3.5" /> },
];

export function PagesSettingsClient() {
  const [activeTab, setActiveTab] = useState('about');
  const [saved, setSaved] = useState(false);
  
  const [pages, setPages] = useState({
    about: 'Amana Mart is Bangladesh\'s leading multi-module marketplace...',
    terms: 'By using Amana Mart, you agree to our terms and conditions...',
    privacy: 'Your privacy is important to us. We collect data only to improve your experience...',
    refund: 'Refunds are processed within 7-10 business days after approval...',
    shipping: 'We ship to all 64 districts of Bangladesh through our logistics partners...',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const activePageLabel = TABS.find(t => t.id === activeTab)?.label || '';

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Pages & Content"
        subtitle="Manage your marketplace static pages and legal content"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: 'Pages' }]}
        actions={
          <Button
            variant={saved ? 'success' : 'primary'}
            size="sm"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        }
      />

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
        <div className="px-5 pt-4 bg-[var(--card)] border-b border-[var(--border)]">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">{activePageLabel}</h3>
            <p className="text-[12px] text-[var(--muted-foreground)]">This content will be displayed on the {activePageLabel} page of the storefront.</p>
          </div>

          <div className="space-y-4">
            <Textarea
              value={pages[activeTab as keyof typeof pages]}
              onChange={(e) => setPages({ ...pages, [activeTab]: e.target.value })}
              rows={20}
              className="font-mono text-[13px] leading-relaxed"
              placeholder={`Enter ${activePageLabel} content here...`}
            />
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-[var(--radius)] flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[12px] text-blue-800">
                <p className="font-semibold mb-1">Rich Text Support</p>
                <p>Currently supporting plain text and basic HTML. A full Rich Text Editor (WYSIWYG) integration is planned for the next update.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

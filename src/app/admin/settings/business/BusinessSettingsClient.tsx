'use client';

import React, { useState } from 'react';
import { Save, Store, DollarSign, Globe, Bell, Shield, Truck, ShieldCheck, Lock, Settings2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/Tabs';

const TABS = [
  { id: 'general', label: 'General', icon: <Store className="w-3.5 h-3.5" /> },
  { id: 'currency', label: 'Currency & Payment', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { id: 'delivery', label: 'Delivery', icon: <Truck className="w-3.5 h-3.5" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-3.5 h-3.5" /> },
  { id: 'security', label: 'Security', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'seo', label: 'SEO & Social', icon: <Globe className="w-3.5 h-3.5" /> },
];

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-6 py-4 border-b border-[var(--border)] last:border-none">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--foreground)]">{label}</p>
        {description && <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5">{description}</p>}
      </div>
      <div className="w-72 shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`}
        />
      </div>
      {label && <span className="text-[13px] text-[var(--foreground)]">{label}</span>}
    </label>
  );
}

export function BusinessSettingsClient() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    businessName: 'Amana Mart',
    tagline: "Bangladesh's Smartest Marketplace",
    phone: '+880 1700-000000',
    email: 'info@amanamart.com.bd',
    address: 'House 42, Road 11, Gulshan 2, Dhaka 1212',
    country: 'Bangladesh',
    timezone: 'Asia/Dhaka',
    orderPrefix: 'AM',
  });

  const [currency, setCurrency] = useState({
    currency: 'BDT',
    symbol: '৳',
    symbolPlacement: 'left',
    decimal: '2',
    commission: '10',
    vatTax: '0',
    freeDeliveryOver: '500',
  });

  const [delivery, setDelivery] = useState({
    minDeliveryTime: '30',
    maxDeliveryTime: '60',
    deliveryFee: '60',
    selfDelivery: true,
    thirdPartyDelivery: false,
    shippingPolicy: 'Standard delivery across all major cities.',
    cancellationPolicy: 'Full refund if cancelled before processing.',
  });

  const [notifications, setNotifications] = useState({
    emailNotification: true,
    smsNotification: true,
    pushNotification: true,
    orderNotification: true,
    storeNotification: true,
  });

  const [security, setSecurity] = useState({
    maintenanceMode: false,
    customerLogin: true,
    emailVerification: true,
    smsVerification: false,
    forceSsl: true,
    twoFactorAdmin: true,
  });

  const [seo, setSeo] = useState({
    metaTitle: 'Amana Mart — Bangladesh\'s Smartest Marketplace',
    metaDescription: 'Shop from multi-module marketplace for groceries, pharmacy, electronics and more.',
    metaKeywords: 'marketplace, bangladesh, grocery, pharmacy, ecommerce',
    facebook: 'https://facebook.com/amanamart',
    instagram: 'https://instagram.com/amanamart',
    twitter: 'https://twitter.com/amanamart',
    linkedin: 'https://linkedin.com/company/amanamart',
    youtube: 'https://youtube.com/amanamart',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Business Settings"
        subtitle="Configure your marketplace business settings"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: 'Business' }]}
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
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-0">
              <SettingRow label="Business Name" description="Your marketplace display name">
                <Input value={general.businessName} onChange={(e) => setGeneral({ ...general, businessName: e.target.value })} />
              </SettingRow>
              <SettingRow label="Tagline" description="A short description shown in the header">
                <Input value={general.tagline} onChange={(e) => setGeneral({ ...general, tagline: e.target.value })} />
              </SettingRow>
              <SettingRow label="Contact Phone" description="Primary customer service number">
                <Input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} />
              </SettingRow>
              <SettingRow label="Contact Email">
                <Input type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} />
              </SettingRow>
              <SettingRow label="Business Address">
                <Textarea value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} rows={3} />
              </SettingRow>
              <SettingRow label="Order ID Prefix" description="Prefix used in order IDs (e.g., AM-10001)">
                <Input value={general.orderPrefix} onChange={(e) => setGeneral({ ...general, orderPrefix: e.target.value })} className="w-24" />
              </SettingRow>
              <SettingRow label="Timezone">
                <Select
                  options={[
                    { value: 'Asia/Dhaka', label: 'Asia/Dhaka (UTC+6)' },
                    { value: 'UTC', label: 'UTC' },
                  ]}
                  value={general.timezone}
                  onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                />
              </SettingRow>
            </div>
          )}

          {/* Currency Tab */}
          {activeTab === 'currency' && (
            <div className="space-y-0">
              <SettingRow label="Currency" description="Primary currency for transactions">
                <Select
                  options={[{ value: 'BDT', label: 'BDT — Bangladeshi Taka (৳)' }, { value: 'USD', label: 'USD — US Dollar ($)' }]}
                  value={currency.currency}
                  onChange={(e) => setCurrency({ ...currency, currency: e.target.value })}
                />
              </SettingRow>
              <SettingRow label="Currency Symbol">
                <Input value={currency.symbol} onChange={(e) => setCurrency({ ...currency, symbol: e.target.value })} className="w-24" />
              </SettingRow>
              <SettingRow label="Symbol Placement" description="Where to display the currency symbol">
                <Select
                  options={[{ value: 'left', label: 'Left (৳100)' }, { value: 'right', label: 'Right (100৳)' }]}
                  value={currency.symbolPlacement}
                  onChange={(e) => setCurrency({ ...currency, symbolPlacement: e.target.value })}
                />
              </SettingRow>
              <SettingRow label="Digit After Decimal" description="Number of decimal places to show">
                <Input type="number" value={currency.decimal} onChange={(e) => setCurrency({ ...currency, decimal: e.target.value })} className="w-24" />
              </SettingRow>
              <SettingRow label="Platform Commission (%)" description="Percentage taken from vendor sales">
                <Input type="number" value={currency.commission} onChange={(e) => setCurrency({ ...currency, commission: e.target.value })} hint="Default: 10%" />
              </SettingRow>
              <SettingRow label="VAT/Tax (%)" description="Applied to all orders">
                <Input type="number" value={currency.vatTax} onChange={(e) => setCurrency({ ...currency, vatTax: e.target.value })} hint="0 = no tax" />
              </SettingRow>
              <SettingRow label="Free Delivery Above (৳)" description="Order value for free delivery eligibility">
                <Input type="number" value={currency.freeDeliveryOver} onChange={(e) => setCurrency({ ...currency, freeDeliveryOver: e.target.value })} />
              </SettingRow>
            </div>
          )}

          {/* Delivery Tab */}
          {activeTab === 'delivery' && (
            <div className="space-y-0">
              <SettingRow label="Minimum Delivery Time" description="Minimum estimated delivery time (minutes)">
                <Input type="number" value={delivery.minDeliveryTime} onChange={(e) => setDelivery({ ...delivery, minDeliveryTime: e.target.value })} />
              </SettingRow>
              <SettingRow label="Maximum Delivery Time" description="Maximum estimated delivery time (minutes)">
                <Input type="number" value={delivery.maxDeliveryTime} onChange={(e) => setDelivery({ ...delivery, maxDeliveryTime: e.target.value })} />
              </SettingRow>
              <SettingRow label="Base Delivery Fee (৳)">
                <Input type="number" value={delivery.deliveryFee} onChange={(e) => setDelivery({ ...delivery, deliveryFee: e.target.value })} />
              </SettingRow>
              <SettingRow label="Self Delivery" description="Allow stores to deliver with their own drivers">
                <Toggle checked={delivery.selfDelivery} onChange={(v) => setDelivery({ ...delivery, selfDelivery: v })} />
              </SettingRow>
              <SettingRow label="3rd Party Delivery" description="Allow third-party delivery integrations">
                <Toggle checked={delivery.thirdPartyDelivery} onChange={(v) => setDelivery({ ...delivery, thirdPartyDelivery: v })} />
              </SettingRow>
              <SettingRow label="Shipping Policy Summary">
                <Textarea value={delivery.shippingPolicy} onChange={(e) => setDelivery({ ...delivery, shippingPolicy: e.target.value })} rows={3} />
              </SettingRow>
              <SettingRow label="Cancellation Policy Summary">
                <Textarea value={delivery.cancellationPolicy} onChange={(e) => setDelivery({ ...delivery, cancellationPolicy: e.target.value })} rows={3} />
              </SettingRow>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-0">
              <SettingRow label="Email Notifications" description="Send notifications via email">
                <Toggle checked={notifications.emailNotification} onChange={(v) => setNotifications({ ...notifications, emailNotification: v })} />
              </SettingRow>
              <SettingRow label="SMS Notifications" description="Send notifications via SMS">
                <Toggle checked={notifications.smsNotification} onChange={(v) => setNotifications({ ...notifications, smsNotification: v })} />
              </SettingRow>
              <SettingRow label="Push Notifications" description="Send push notifications to mobile apps">
                <Toggle checked={notifications.pushNotification} onChange={(v) => setNotifications({ ...notifications, pushNotification: v })} />
              </SettingRow>
              <SettingRow label="Order Notifications" description="Notify customers on order status changes">
                <Toggle checked={notifications.orderNotification} onChange={(v) => setNotifications({ ...notifications, orderNotification: v })} />
              </SettingRow>
              <SettingRow label="Store Notifications" description="Notify store owners on new orders">
                <Toggle checked={notifications.storeNotification} onChange={(v) => setNotifications({ ...notifications, storeNotification: v })} />
              </SettingRow>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-0">
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[var(--radius)] flex gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[13px] text-amber-800">
                  <p className="font-semibold mb-1">Security Warning</p>
                  <p>Changes to security settings might require users to re-authenticate. Proceed with caution when enabling mandatory verification.</p>
                </div>
              </div>
              
              <SettingRow label="Maintenance Mode" description="Only admins can access the site when enabled">
                <Toggle checked={security.maintenanceMode} onChange={(v) => setSecurity({ ...security, maintenanceMode: v })} />
              </SettingRow>
              <SettingRow label="Customer Login Required" description="Force users to log in to see products/prices">
                <Toggle checked={security.customerLogin} onChange={(v) => setSecurity({ ...security, customerLogin: v })} />
              </SettingRow>
              <SettingRow label="Email Verification" description="Require email verification for new customers">
                <Toggle checked={security.emailVerification} onChange={(v) => setSecurity({ ...security, emailVerification: v })} />
              </SettingRow>
              <SettingRow label="SMS Verification" description="Require OTP verification for new registrations">
                <Toggle checked={security.smsVerification} onChange={(v) => setSecurity({ ...security, smsVerification: v })} />
              </SettingRow>
              <SettingRow label="Force SSL / HTTPS" description="Redirect all HTTP traffic to HTTPS">
                <Toggle checked={security.forceSsl} onChange={(v) => setSecurity({ ...security, forceSsl: v })} />
              </SettingRow>
              <SettingRow label="2FA for Admin" description="Enable Two-Factor Authentication for admin logins">
                <Toggle checked={security.twoFactorAdmin} onChange={(v) => setSecurity({ ...security, twoFactorAdmin: v })} />
              </SettingRow>

              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <Button variant="outline" size="sm" leftIcon={<Lock className="w-4 h-4" />}>
                  Manage Admin Passwords
                </Button>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="space-y-0">
                <h3 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-[var(--primary)]" />
                  SEO Configuration
                </h3>
                <SettingRow label="Meta Title" description="The title displayed in search engine results">
                  <Input value={seo.metaTitle} onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })} />
                </SettingRow>
                <SettingRow label="Meta Description" description="A brief summary of your site for search engines">
                  <Textarea value={seo.metaDescription} onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })} rows={3} />
                </SettingRow>
                <SettingRow label="Meta Keywords" description="Comma-separated keywords (e.g. food, delivery)">
                  <Input value={seo.metaKeywords} onChange={(e) => setSeo({ ...seo, metaKeywords: e.target.value })} />
                </SettingRow>
              </div>

              <div className="space-y-0 pt-6 border-t border-[var(--border)]">
                <h3 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--primary)]" />
                  Social Media Links
                </h3>
                <SettingRow label="Facebook Page">
                  <Input value={seo.facebook} onChange={(e) => setSeo({ ...seo, facebook: e.target.value })} placeholder="https://..." />
                </SettingRow>
                <SettingRow label="Instagram Profile">
                  <Input value={seo.instagram} onChange={(e) => setSeo({ ...seo, instagram: e.target.value })} placeholder="https://..." />
                </SettingRow>
                <SettingRow label="Twitter / X Profile">
                  <Input value={seo.twitter} onChange={(e) => setSeo({ ...seo, twitter: e.target.value })} placeholder="https://..." />
                </SettingRow>
                <SettingRow label="LinkedIn Company">
                  <Input value={seo.linkedin} onChange={(e) => setSeo({ ...seo, linkedin: e.target.value })} placeholder="https://..." />
                </SettingRow>
                <SettingRow label="YouTube Channel">
                  <Input value={seo.youtube} onChange={(e) => setSeo({ ...seo, youtube: e.target.value })} placeholder="https://..." />
                </SettingRow>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

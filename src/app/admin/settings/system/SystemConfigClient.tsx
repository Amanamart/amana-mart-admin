'use client';

import React, { useState } from 'react';
import { Database, Mail, MessageSquare, MapPin, Cloud, Bell, Shield, Save } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';

const CONFIG_TABS = [
  { id: 'email', label: '📧 Email' },
  { id: 'sms', label: '📱 SMS' },
  { id: 'maps', label: '🗺️ Maps' },
  { id: 'storage', label: '☁️ Storage' },
  { id: 'payment', label: '💳 Payments' },
  { id: 'security', label: '🔒 Security' },
];

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--border)]">
      <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--secondary-light)] flex items-center justify-center text-[var(--secondary)]">
        {icon}
      </div>
      <div>
        <p className="text-[14px] font-bold text-[var(--foreground)]">{title}</p>
        <p className="text-[12px] text-[var(--muted-foreground)]">{subtitle}</p>
      </div>
    </div>
  );
}

export function SystemConfigClient() {
  const [activeTab, setActiveTab] = useState('email');

  const renderTab = () => {
    switch (activeTab) {
      case 'email':
        return (
          <div className="space-y-4">
            <SectionTitle icon={<Mail className="w-4 h-4" />} title="Email Configuration" subtitle="SMTP settings for transactional emails" />
            <Select label="Mail Driver" required options={[{ value: 'smtp', label: 'SMTP' }, { value: 'sendgrid', label: 'SendGrid' }, { value: 'ses', label: 'Amazon SES' }, { value: 'mailgun', label: 'Mailgun' }]} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="SMTP Host" required placeholder="smtp.gmail.com" />
              <Input label="SMTP Port" type="number" required placeholder="587" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Username" placeholder="noreply@amanamart.com" />
              <Input label="Password" type="password" placeholder="App password" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="From Name" placeholder="Amana Mart" />
              <Input label="From Email" type="email" placeholder="noreply@amanamart.com" />
            </div>
            <Select label="Encryption" options={[{ value: 'tls', label: 'TLS' }, { value: 'ssl', label: 'SSL' }, { value: 'none', label: 'None' }]} />
          </div>
        );
      case 'sms':
        return (
          <div className="space-y-4">
            <SectionTitle icon={<MessageSquare className="w-4 h-4" />} title="SMS Gateway" subtitle="Configure SMS provider for OTP and notifications" />
            <Select label="SMS Provider" required options={[{ value: 'twilio', label: 'Twilio' }, { value: 'nexmo', label: 'Vonage (Nexmo)' }, { value: 'msg91', label: 'MSG91' }, { value: 'custom', label: 'Custom Gateway' }]} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="API Key / SID" required placeholder="Your API key" />
              <Input label="API Secret / Token" type="password" required placeholder="Your secret" />
            </div>
            <Input label="Sender ID" placeholder="AMANAMART" />
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-[var(--radius-md)]">
              <p className="text-[12px] text-amber-700">For Bangladeshi users, we recommend Green Web / SSL Commerz SMS gateway for best deliverability.</p>
            </div>
          </div>
        );
      case 'maps':
        return (
          <div className="space-y-4">
            <SectionTitle icon={<MapPin className="w-4 h-4" />} title="Maps & Location" subtitle="API keys for maps and geocoding" />
            <Select label="Map Provider" options={[{ value: 'google', label: 'Google Maps' }, { value: 'mapbox', label: 'Mapbox' }, { value: 'here', label: 'HERE Maps' }]} />
            <Input label="Google Maps API Key" type="password" placeholder="AIza..." />
            <Input label="Geocoding API Key" type="password" placeholder="Same or different key" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Default Latitude" placeholder="23.8103" />
              <Input label="Default Longitude" placeholder="90.4125" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Default Zoom Level" type="number" placeholder="12" />
              <Select label="Default City" options={[{ value: 'dhaka', label: 'Dhaka' }, { value: 'chattogram', label: 'Chattogram' }]} />
            </div>
          </div>
        );
      case 'storage':
        return (
          <div className="space-y-4">
            <SectionTitle icon={<Cloud className="w-4 h-4" />} title="File Storage" subtitle="S3-compatible storage for uploads and media" />
            <Select label="Storage Driver" options={[{ value: 's3', label: 'Amazon S3' }, { value: 'r2', label: 'Cloudflare R2' }, { value: 'minio', label: 'MinIO (Local)' }, { value: 'gcs', label: 'Google Cloud Storage' }]} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Bucket Name" required placeholder="amana-mart-uploads" />
              <Input label="Region" placeholder="us-east-1" />
            </div>
            <Input label="Endpoint URL" placeholder="https://your-endpoint.r2.cloudflarestorage.com" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Access Key ID" type="password" placeholder="Your access key" />
              <Input label="Secret Access Key" type="password" placeholder="Your secret key" />
            </div>
            <Input label="Public CDN URL" placeholder="https://cdn.amanamart.com" />
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-4">
            <SectionTitle icon={<Database className="w-4 h-4" />} title="Payment Gateways" subtitle="Configure payment providers" />
            {[
              { name: 'bKash', color: '#e2136e' },
              { name: 'Nagad', color: '#f37021' },
              { name: 'Stripe', color: '#635bff' },
              { name: 'SSLCommerz', color: '#005555' },
            ].map((gw) => (
              <div key={gw.name} className="border border-[var(--border)] rounded-[var(--radius-md)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: gw.color }}>
                      {gw.name.slice(0, 2)}
                    </div>
                    <p className="text-[13px] font-semibold">{gw.name}</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[var(--primary)]" defaultChecked={gw.name !== 'Stripe'} />
                    <span className="text-[12px] text-[var(--muted-foreground)]">Enabled</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder={`${gw.name} App Key / Client ID`} />
                  <Input type="password" placeholder={`${gw.name} Secret Key`} />
                </div>
              </div>
            ))}
          </div>
        );
      case 'security':
        return (
          <div className="space-y-4">
            <SectionTitle icon={<Shield className="w-4 h-4" />} title="Security Settings" subtitle="Authentication and rate limiting configuration" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Session Timeout (minutes)" type="number" placeholder="60" />
              <Input label="Max Login Attempts" type="number" placeholder="5" />
            </div>
            <Input label="JWT Secret Key" type="password" placeholder="Your JWT signing secret" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Token Expiry (hours)" type="number" placeholder="24" />
              <Input label="Refresh Token Expiry (days)" type="number" placeholder="30" />
            </div>
            <div className="space-y-3">
              {[
                { key: 'mfa', label: 'Require 2FA for Admin Login', hint: 'Recommended for production' },
                { key: 'audit', label: 'Enable Audit Logging', hint: 'Track all admin actions' },
                { key: 'ratelimit', label: 'Enable Rate Limiting', hint: 'Protect API from abuse' },
                { key: 'recaptcha', label: 'Enable reCAPTCHA', hint: 'On login and registration forms' },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-[var(--radius-md)] cursor-pointer hover:bg-[var(--muted)] transition-colors">
                  <input type="checkbox" className="accent-[var(--primary)]" defaultChecked={item.key !== 'mfa'} />
                  <div>
                    <p className="text-[13px] font-medium">{item.label}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">{item.hint}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="System Configuration"
        subtitle="Configure third-party integrations and system services"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: 'System Config' }]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-2 h-fit">
          {CONFIG_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2.5 rounded-[var(--radius)] text-[13px] font-medium transition-all ${activeTab === tab.id ? 'bg-[var(--secondary-light)] text-[var(--secondary)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="lg:col-span-3 bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
          {renderTab()}
          <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-[var(--border)]">
            <Button variant="outline">Reset</Button>
            <Button variant="secondary" leftIcon={<Save className="w-4 h-4" />}>Save Configuration</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

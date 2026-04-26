'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { PageHeader } from '@/components/admin/PageHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/utils';

const monthlyRevenue = [
  { month: 'Jan', revenue: 420000, commission: 42000, orders: 1240 },
  { month: 'Feb', revenue: 380000, commission: 38000, orders: 1050 },
  { month: 'Mar', revenue: 610000, commission: 61000, orders: 1890 },
  { month: 'Apr', revenue: 540000, commission: 54000, orders: 1560 },
  { month: 'May', revenue: 720000, commission: 72000, orders: 2100 },
  { month: 'Jun', revenue: 680000, commission: 68000, orders: 1950 },
  { month: 'Jul', revenue: 850000, commission: 85000, orders: 2450 },
  { month: 'Aug', revenue: 790000, commission: 79000, orders: 2280 },
  { month: 'Sep', revenue: 920000, commission: 92000, orders: 2670 },
  { month: 'Oct', revenue: 1050000, commission: 105000, orders: 3020 },
  { month: 'Nov', revenue: 980000, commission: 98000, orders: 2810 },
  { month: 'Dec', revenue: 1200000, commission: 120000, orders: 3450 },
];

const moduleData = [
  { name: 'Grocery', value: 35, color: '#1aab50' },
  { name: 'eCommerce', value: 28, color: '#3b82f6' },
  { name: 'Pharmacy', value: 15, color: '#ef4444' },
  { name: 'Food', value: 12, color: '#f59e0b' },
  { name: 'Electronics', value: 10, color: '#8b5cf6' },
];

const paymentData = [
  { method: 'bKash', amount: 3200000, share: 38 },
  { method: 'Nagad', amount: 2100000, share: 25 },
  { method: 'Cash', amount: 1800000, share: 21 },
  { method: 'Card', amount: 900000, share: 11 },
  { method: 'Rocket', amount: 400000, share: 5 },
];

export function ReportsClient() {
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Business performance overview and financial reports"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Reports' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-white border border-[var(--border)] rounded-[var(--radius-md)]">
              {(['monthly', 'quarterly', 'yearly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded text-[12px] font-medium capitalize cursor-pointer transition-all ${
                    period === p ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="৳8.4M" subtitle="This year" change={18} />
        <StatCard title="Platform Commission" value="৳840K" subtitle="10% of revenue" change={18} />
        <StatCard title="Total Orders" value="24,420" subtitle="This year" change={12} />
        <StatCard title="Avg. Order Value" value="৳590" subtitle="Per order" change={5} />
      </div>

      {/* Revenue Trend */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>Revenue & Commission Trend</CardTitle>
          <p className="text-[12px] text-[var(--muted-foreground)]">Monthly breakdown (BDT)</p>
        </CardHeader>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1aab50" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#1aab50" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: any, name: any) => [formatCurrency(v), name]} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1aab50" fill="url(#colorRevenue)" strokeWidth={2} />
            <Area type="monotone" dataKey="commission" name="Commission" stroke="#3b82f6" fill="url(#colorCommission)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Module Distribution */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Revenue by Module</CardTitle>
          </CardHeader>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={moduleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {moduleData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {moduleData.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="text-[12px] text-[var(--foreground)] flex-1">{m.name}</span>
                  <span className="text-[12px] font-semibold">{m.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Revenue by Payment Method</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={paymentData} layout="vertical" margin={{ left: 10, right: 10 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="method" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Bar dataKey="amount" name="Amount" fill="#1aab50" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Orders Table */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>Monthly Order Summary</CardTitle>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>Export CSV</Button>
        </CardHeader>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f8f9fb] border-b border-[var(--border)]">
                {['Month', 'Revenue', 'Commission', 'Orders', 'Avg. Order', 'Growth'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {monthlyRevenue.map((row, i) => {
                const prev = monthlyRevenue[i - 1];
                const growth = prev ? Math.round(((row.revenue - prev.revenue) / prev.revenue) * 100) : null;
                return (
                  <tr key={i} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-medium">{row.month} 2026</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[var(--primary)]">{formatCurrency(row.revenue)}</td>
                    <td className="px-4 py-3 text-[13px]">{formatCurrency(row.commission)}</td>
                    <td className="px-4 py-3 text-[13px]">{row.orders.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[13px]">{formatCurrency(Math.round(row.revenue / row.orders))}</td>
                    <td className="px-4 py-3 text-[13px]">
                      {growth !== null ? (
                        <span className={growth >= 0 ? 'text-green-600' : 'text-red-500'}>
                          {growth >= 0 ? '+' : ''}{growth}%
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

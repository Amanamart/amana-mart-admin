'use client';

import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  Store,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  RefreshCcw,
  Zap,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Eye,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatCard, OrderStatusCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatNumber } from '@/lib/utils';

const orderStatusCards = [

  { label: 'Pending Orders', count: 124, icon: <Clock className="w-5 h-5" />, color: '#f59e0b', bgColor: '#fef3c7' },
  { label: 'Confirmed Orders', count: 89, icon: <CheckCircle2 className="w-5 h-5" />, color: '#0ea5e9', bgColor: '#e0f2fe' },
  { label: 'Processing', count: 67, icon: <RefreshCcw className="w-5 h-5" />, color: '#7c3aed', bgColor: '#ede9fe' },
  { label: 'Out for Delivery', count: 43, icon: <Truck className="w-5 h-5" />, color: '#10b981', bgColor: '#d1fae5' },
  { label: 'Delivered Today', count: 312, icon: <CheckCircle2 className="w-5 h-5" />, color: '#22c55e', bgColor: '#dcfce7' },
  { label: 'Cancelled', count: 18, icon: <XCircle className="w-5 h-5" />, color: '#ef4444', bgColor: '#fee2e2' },
  { label: 'Refunded', count: 6, icon: <AlertCircle className="w-5 h-5" />, color: '#9ca3af', bgColor: '#f3f4f6' },
  { label: 'Flash Sale Active', count: 3, icon: <Zap className="w-5 h-5" />, color: '#8b5cf6', bgColor: '#ede9fe' },
];

// ── Custom tooltip ──────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[var(--border)] rounded-[var(--radius)] p-3 shadow-[var(--shadow-md)] text-[12px]">
      <p className="font-semibold text-[var(--foreground)] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.name === 'Sales' ? formatCurrency(p.value) : formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
}

import { useAdminStats, useOrderChart, useReportsOverview } from '@/hooks/useAdminDashboard';

// ── Main Dashboard ──────────────────────────────────────────
export function AdminDashboardClient() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: chartData, isLoading: chartLoading } = useOrderChart(period === 'week' ? 7 : 30);
  const { data: reportsData } = useReportsOverview();

  if (statsLoading || chartLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] text-[var(--muted-foreground)]">Loading dashboard data...</p>
      </div>
    );
  }

  const stats = (statsData as any)?.stats || { totalOrders: 0, totalRevenue: 0, totalCustomers: 0, totalStores: 0, totalProducts: 0 };
  const recentOrdersList = (statsData as any)?.recentOrders || [];
  const topStoresList = (reportsData as any)?.topStores || [];

  // Map backend chart data to Recharts format
  const formattedChartData = chartData?.map((item: any) => ({
    label: item.date.split('-').slice(1).join('/'), // MM/DD
    sales: item.revenue,
    orders: item.orders,
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-[13px] text-[var(--muted-foreground)] mt-0.5">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-white border border-[var(--border)] rounded-[var(--radius-md)]">
          {(['today', 'week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-[var(--radius)] text-[12px] font-medium transition-all capitalize cursor-pointer ${
                period === p
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>


      {/* Stat Cards — Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={formatNumber(stats.totalProducts)}
          subtitle="Across all stores"
          icon={<Package className="w-5 h-5 text-[var(--primary)]" />}
          iconBg="var(--primary-light)"
          change={0}
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(stats.totalOrders)}
          subtitle="Total delivered"
          icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
          iconBg="#dbeafe"
          change={0}
        />
        <StatCard
          title="Active Stores"
          value={formatNumber(347)}
          subtitle="Approved vendors"
          icon={<Store className="w-5 h-5 text-purple-500" />}
          iconBg="#ede9fe"
          change={5}
        />
        <StatCard
          title="Total Customers"
          value={formatNumber(38940)}
          subtitle="Registered users"
          icon={<Users className="w-5 h-5 text-amber-500" />}
          iconBg="#fef3c7"
          change={15}
        />
      </div>

      {/* Revenue Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[#0d8a40] rounded-[var(--radius-lg)] p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-medium opacity-90">Total Revenue</p>
            <DollarSign className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-[12px] opacity-75 mt-1">+18% vs last month</p>
        </div>
        <div className="bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] rounded-[var(--radius-lg)] p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-medium opacity-90">Commission Earned</p>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">৳1.2M</p>
          <p className="text-[12px] opacity-75 mt-1">+23% vs last month</p>
        </div>
        <div className="bg-gradient-to-br from-[#7c3aed] to-[#a855f7] rounded-[var(--radius-lg)] p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-medium opacity-90">Avg. Order Value</p>
            <Eye className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">৳590</p>
          <p className="text-[12px] opacity-75 mt-1">+4% vs last month</p>
        </div>
      </div>

      {/* Order Status Grid — Row 2 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Order Status Overview</h2>
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            View All Orders
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {orderStatusCards.map((card, i) => (
            <OrderStatusCard key={i} {...card} />
          ))}
        </div>
      </div>

      {/* Charts — Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gross Sales Chart */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Gross Sales</CardTitle>
            <p className="text-[12px] text-[var(--muted-foreground)]">Monthly revenue (BDT)</p>
          </CardHeader>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={formattedChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="sales" name="Sales" stroke="var(--primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: 'var(--primary)' }} />
              <Line type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>

        </Card>

        {/* User Statistics Chart */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <p className="text-[12px] text-[var(--muted-foreground)]">Customers & vendors registered</p>
          </CardHeader>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[]} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="customers" name="Customers" fill="var(--primary)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="vendors" name="Vendors" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

        </Card>
      </div>

      {/* Bottom Row — Recent Orders + Top Stores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <Card padding="none" className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Recent Orders</h2>
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All
            </Button>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentOrdersList.map((order: any) => (
              <div key={order.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafafa] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-[var(--primary)]">#{order.orderNumber || order.id.slice(0,8)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-[12px] text-[var(--muted-foreground)] truncate">
                    {order.customer?.name} · {order.store?.name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-semibold text-[var(--foreground)]">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Stores */}
        <Card padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Top Stores</h2>
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              All Stores
            </Button>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {topStoresList.length > 0 ? topStoresList.map((store: any, i: number) => (
              <div key={store.id || i} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafafa] transition-colors">
                <div
                  className="w-8 h-8 rounded-[var(--radius)] flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: `hsl(${i * 50 + 140}, 55%, 45%)` }}
                >
                  {(store.name || 'S').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--foreground)] truncate">{store.name || 'Unnamed Store'}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">{store._count?.orders || 0} orders · ⭐ {store.rating || 0}</p>
                </div>
                <p className="text-[12px] font-semibold text-[var(--foreground)] shrink-0">
                  {formatCurrency(store.totalRevenue || 0)}
                </p>
              </div>
            )) : (
              <div className="p-8 text-center text-[12px] text-[var(--muted-foreground)]">No data available</div>
            )}
          </div>

        </Card>
      </div>
    </div>
  );
}

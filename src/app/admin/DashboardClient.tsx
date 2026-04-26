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

// ── Mock Data ──────────────────────────────────────────────
const salesData = [
  { month: 'Jan', sales: 420000, orders: 1240 },
  { month: 'Feb', sales: 380000, orders: 1050 },
  { month: 'Mar', sales: 610000, orders: 1890 },
  { month: 'Apr', sales: 540000, orders: 1560 },
  { month: 'May', sales: 720000, orders: 2100 },
  { month: 'Jun', sales: 680000, orders: 1950 },
  { month: 'Jul', sales: 850000, orders: 2450 },
  { month: 'Aug', sales: 790000, orders: 2280 },
  { month: 'Sep', sales: 920000, orders: 2670 },
  { month: 'Oct', sales: 1050000, orders: 3020 },
  { month: 'Nov', sales: 980000, orders: 2810 },
  { month: 'Dec', sales: 1200000, orders: 3450 },
];

const userStats = [
  { month: 'Jan', customers: 340, vendors: 12 },
  { month: 'Feb', customers: 290, vendors: 8 },
  { month: 'Mar', customers: 520, vendors: 19 },
  { month: 'Apr', customers: 410, vendors: 14 },
  { month: 'May', customers: 680, vendors: 24 },
  { month: 'Jun', customers: 590, vendors: 20 },
  { month: 'Jul', customers: 810, vendors: 31 },
  { month: 'Aug', customers: 740, vendors: 27 },
  { month: 'Sep', customers: 920, vendors: 35 },
  { month: 'Oct', customers: 1050, vendors: 42 },
  { month: 'Nov', customers: 980, vendors: 38 },
  { month: 'Dec', customers: 1250, vendors: 51 },
];

const recentOrders = [
  { id: 'AM-10567', customer: 'Rahim Ahmed', store: 'Dhaka Fresh Market', amount: 2450, status: 'pending', time: '2 min ago' },
  { id: 'AM-10566', customer: 'Fatima Begum', store: 'BD Electronics', amount: 12800, status: 'confirmed', time: '8 min ago' },
  { id: 'AM-10565', customer: 'Karim Hossain', store: 'Dhaka Pharmacy', amount: 950, status: 'processing', time: '15 min ago' },
  { id: 'AM-10564', customer: 'Nasrin Islam', store: 'Amana Grocery', amount: 3200, status: 'out_for_delivery', time: '32 min ago' },
  { id: 'AM-10563', customer: 'Hasan Ali', store: 'Fashion Hub BD', amount: 8750, status: 'delivered', time: '1 hr ago' },
  { id: 'AM-10562', customer: 'Sumaiya Khan', store: 'BD Electronics', amount: 15400, status: 'cancelled', time: '2 hr ago' },
];

const topStores = [
  { name: 'Dhaka Fresh Market', orders: 342, revenue: 820000, rating: 4.8 },
  { name: 'BD Electronics', orders: 218, revenue: 2150000, rating: 4.6 },
  { name: 'Amana Grocery', orders: 189, revenue: 540000, rating: 4.9 },
  { name: 'Fashion Hub BD', orders: 156, revenue: 960000, rating: 4.5 },
  { name: 'Dhaka Pharmacy', orders: 134, revenue: 380000, rating: 4.7 },
];

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

import { useAdminStats, useOrderChart } from '@/hooks/useAdminDashboard';

// ── Main Dashboard ──────────────────────────────────────────
export function AdminDashboardClient() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: chartData, isLoading: chartLoading } = useOrderChart(period === 'week' ? 7 : 30);

  if (statsLoading || chartLoading) return <div className="p-8 text-center">Loading dashboard data...</div>;

  const stats = statsData?.stats || { totalOrders: 0, totalRevenue: 0, totalCustomers: 0, totalStores: 0, totalProducts: 0 };
  const recentOrdersList = statsData?.recentOrders || [];
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
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
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
            <BarChart data={userStats} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
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
            {topStores.map((store, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafafa] transition-colors">
                <div
                  className="w-8 h-8 rounded-[var(--radius)] flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: `hsl(${i * 50 + 140}, 55%, 45%)` }}
                >
                  {store.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--foreground)] truncate">{store.name}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">{store.orders} orders · ⭐ {store.rating}</p>
                </div>
                <p className="text-[12px] font-semibold text-[var(--foreground)] shrink-0">
                  {formatCurrency(store.revenue)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

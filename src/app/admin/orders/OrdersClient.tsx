'use client';

import React, { useState, useMemo } from 'react';
import { Eye, Printer, RefreshCcw } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { DataTable, TablePagination, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDateTime } from '@/lib/utils';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';

interface Order {
  id: string;
  orderId: string;
  customer: string;
  store: string;
  amount: number;
  status: OrderStatus;
  payment: string;
  items: number;
  createdAt: string;
  zone: string;
}

// ── Mock Data ──────────────────────────────────────────────
const generateOrders = (): Order[] =>
  Array.from({ length: 60 }, (_, i) => {
    const statuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];
    const stores = ['Dhaka Fresh Market', 'BD Electronics', 'Amana Grocery', 'Fashion Hub BD', 'Dhaka Pharmacy', 'Tech World'];
    const customers = ['Rahim Ahmed', 'Fatima Begum', 'Karim Hossain', 'Nasrin Islam', 'Hasan Ali', 'Sumaiya Khan'];
    const payments = ['Cash on Delivery', 'bKash', 'Nagad', 'Card', 'Rocket'];
    const zones = ['Dhaka North', 'Dhaka South', 'Chattogram', 'Sylhet', 'Rajshahi'];
    const status = statuses[i % statuses.length];
    const days = Math.floor(i / 2);
    const d = new Date(2026, 3, 19 - days, 10 + (i % 12), (i * 7) % 60);
    return {
      id: `order-${1000 - i}`,
      orderId: `AM-${10567 - i}`,
      customer: customers[i % customers.length],
      store: stores[i % stores.length],
      amount: 500 + (i * 137 + 800) % 25000,
      status,
      payment: payments[i % payments.length],
      items: 1 + (i % 8),
      createdAt: d.toISOString(),
      zone: zones[i % zones.length],
    };
  });

const ORDERS = generateOrders();

const STATUS_TABS = [
  { id: 'all', label: 'All', count: ORDERS.length },
  { id: 'pending', label: 'Pending', count: ORDERS.filter((o) => o.status === 'pending').length },
  { id: 'confirmed', label: 'Confirmed', count: ORDERS.filter((o) => o.status === 'confirmed').length },
  { id: 'processing', label: 'Processing', count: ORDERS.filter((o) => o.status === 'processing').length },
  { id: 'out_for_delivery', label: 'Out for Delivery', count: ORDERS.filter((o) => o.status === 'out_for_delivery').length },
  { id: 'delivered', label: 'Delivered', count: ORDERS.filter((o) => o.status === 'delivered').length },
  { id: 'cancelled', label: 'Cancelled', count: ORDERS.filter((o) => o.status === 'cancelled').length },
  { id: 'refunded', label: 'Refunded', count: ORDERS.filter((o) => o.status === 'refunded').length },
];

export function OrdersClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentFilter, setPaymentFilter] = useState('');
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = ORDERS;
    if (activeTab !== 'all') list = list.filter((o) => o.status === activeTab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.store.toLowerCase().includes(q)
      );
    }
    if (paymentFilter) list = list.filter((o) => o.payment === paymentFilter);
    return list;
  }, [activeTab, search, paymentFilter]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const columns: Column<Order>[] = [
    {
      key: 'orderId',
      header: 'Order ID',
      render: (_, row) => (
        <button
          onClick={() => setSelectedOrder(row)}
          className="text-[var(--primary)] font-semibold hover:underline text-[13px]"
        >
          #{row.orderId}
        </button>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (_, row) => (
        <div>
          <p className="text-[13px] font-medium text-[var(--foreground)]">{row.customer}</p>
          <p className="text-[11px] text-[var(--muted-foreground)]">{row.zone}</p>
        </div>
      ),
    },
    { key: 'store', header: 'Store', render: (v) => <span className="text-[13px]">{v as string}</span> },
    {
      key: 'items',
      header: 'Items',
      align: 'center',
      render: (v) => (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--muted)] text-[12px] font-medium">
          {v as number}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      render: (v) => <span className="font-semibold text-[13px]">{formatCurrency(v as number)}</span>,
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{v as string}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (v) => <StatusBadge status={v as string} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (v) => <span className="text-[12px] text-[var(--muted-foreground)]">{formatDateTime(v as string)}</span>,
    },
    {
      key: 'id',
      header: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setSelectedOrder(row)}
            className="w-7 h-7 rounded-[var(--radius)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="View Order"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            className="w-7 h-7 rounded-[var(--radius)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
            title="Print"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Orders"
        subtitle="Manage all customer orders"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Orders' }]}
        actions={
          <Button variant="outline" size="sm" leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
        }
      />

      {/* Status Tabs */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-x-auto">
        <div className="px-4 pt-4">
          <Tabs tabs={STATUS_TABS} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} />
        </div>

        {/* Filter Bar */}
        <FilterBar
          className="rounded-none border-none border-t border-[var(--border)] mt-0"
          searchValue={search}
          searchPlaceholder="Search by order ID, customer, store..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          onExport={() => alert('Export')}
          filters={
            <Select
              options={[
                { value: 'Cash on Delivery', label: 'Cash on Delivery' },
                { value: 'bKash', label: 'bKash' },
                { value: 'Nagad', label: 'Nagad' },
                { value: 'Card', label: 'Card' },
                { value: 'Rocket', label: 'Rocket' },
              ]}
              placeholder="Payment Method"
              value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
              className="min-w-[160px]"
            />
          }
        />

        {/* Table */}
        <DataTable
          columns={columns}
          data={paginated}
          keyField="id"
          className="rounded-none border-none"
        />

        <TablePagination page={page} perPage={PER_PAGE} total={filtered.length} onPageChange={setPage} />
      </div>

      {/* Order Detail Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.orderId}`}
        subtitle={`Placed on ${selectedOrder ? formatDateTime(selectedOrder.createdAt) : ''}`}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
            <Button variant="primary" leftIcon={<Printer className="w-4 h-4" />}>Print Invoice</Button>
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--muted)] rounded-[var(--radius-md)]">
                <p className="text-[12px] text-[var(--muted-foreground)] font-medium mb-2">Customer Info</p>
                <p className="text-[14px] font-semibold text-[var(--foreground)]">{selectedOrder.customer}</p>
                <p className="text-[12px] text-[var(--muted-foreground)] mt-1">{selectedOrder.zone}</p>
              </div>
              <div className="p-4 bg-[var(--muted)] rounded-[var(--radius-md)]">
                <p className="text-[12px] text-[var(--muted-foreground)] font-medium mb-2">Store</p>
                <p className="text-[14px] font-semibold text-[var(--foreground)]">{selectedOrder.store}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border border-[var(--border)] rounded-[var(--radius-md)] text-center">
                <p className="text-[12px] text-[var(--muted-foreground)]">Total Amount</p>
                <p className="text-[16px] font-bold text-[var(--foreground)] mt-1">{formatCurrency(selectedOrder.amount)}</p>
              </div>
              <div className="p-3 border border-[var(--border)] rounded-[var(--radius-md)] text-center">
                <p className="text-[12px] text-[var(--muted-foreground)]">Payment Method</p>
                <p className="text-[14px] font-semibold text-[var(--foreground)] mt-1">{selectedOrder.payment}</p>
              </div>
              <div className="p-3 border border-[var(--border)] rounded-[var(--radius-md)] text-center">
                <p className="text-[12px] text-[var(--muted-foreground)]">Items</p>
                <p className="text-[16px] font-bold text-[var(--foreground)] mt-1">{selectedOrder.items}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-[var(--muted)] rounded-[var(--radius-md)]">
              <span className="text-[13px] font-medium text-[var(--muted-foreground)]">Status:</span>
              <StatusBadge status={selectedOrder.status} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

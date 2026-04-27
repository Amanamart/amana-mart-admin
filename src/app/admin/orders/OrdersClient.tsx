'use client';

import React, { useState } from 'react';
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



import { useOrders } from '@/hooks/useAdminDashboard';

export function OrdersClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [paymentFilter, setPaymentFilter] = useState('');
  const PER_PAGE = 10;

  const { data: ordersData, isLoading } = useOrders({
    page,
    limit: PER_PAGE,
    search,
    status: activeTab === 'all' ? undefined : activeTab,
    paymentMethod: paymentFilter,
  });

  const orders = (ordersData as any)?.orders || [];
  const total = (ordersData as any)?.total || 0;

  const STATUS_TABS = [
    { id: 'all', label: 'All', count: total },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'processing', label: 'Processing' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'refunded', label: 'Refunded' },
  ];


  const columns: Column<any>[] = [

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
      render: (_, row: any) => (
        <div>
          <p className="text-[13px] font-medium text-[var(--foreground)]">{row.user?.name || 'Guest'}</p>
          <p className="text-[11px] text-[var(--muted-foreground)]">{row.user?.phone || 'No Phone'}</p>
        </div>
      ),
    },
    { key: 'store', header: 'Store', render: (_, row: any) => <span className="text-[13px]">{row.store?.name || 'System'}</span> },

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
          columns={columns as any}
          data={orders}
          loading={isLoading}
          keyField="id"
          className="rounded-none border-none"
        />

        <TablePagination page={page} perPage={PER_PAGE} total={total} onPageChange={setPage} />

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
                <p className="text-[14px] font-semibold text-[var(--foreground)]">{selectedOrder.user?.name || 'Guest'}</p>
                <p className="text-[12px] text-[var(--muted-foreground)] mt-1">{selectedOrder.user?.phone || 'No Phone'}</p>
              </div>
              <div className="p-4 bg-[var(--muted)] rounded-[var(--radius-md)]">
                <p className="text-[12px] text-[var(--muted-foreground)] font-medium mb-2">Store</p>
                <p className="text-[14px] font-semibold text-[var(--foreground)]">{selectedOrder.store?.name || 'System'}</p>
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

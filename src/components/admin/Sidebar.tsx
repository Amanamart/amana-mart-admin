'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Store,
  Users,
  Truck,
  Tag,
  Megaphone,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Wallet,
  Bell,
  Image,
  Globe,
  Shield,
  Database,
  CreditCard,
  MapPin,
  Layers,
  Star,
  PlusCircle,
  List,
  ClipboardList,
  RefreshCcw,
  Zap,
  Gift,
  Monitor,
  UserCog,
  Receipt,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  badge?: string | number;
  badgeColor?: string;
}

const navigation: { group: string; items: NavItem[] }[] = [
  {
    group: '',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
    ],
  },
  {
    group: 'POS',
    items: [
      {
        label: 'New Sale',
        href: '/admin/pos',
        icon: <Monitor className="w-4 h-4" />,
      },
    ],
  },
  {
    group: 'Order Management',
    items: [
      {
        label: 'Orders',
        icon: <ShoppingCart className="w-4 h-4" />,
        children: [
          { label: 'All Orders', href: '/admin/orders', icon: <List className="w-3.5 h-3.5" /> },
          { label: 'Pending', href: '/admin/orders?status=pending', icon: <ClipboardList className="w-3.5 h-3.5" /> },
          { label: 'Processing', href: '/admin/orders?status=processing', icon: <RefreshCcw className="w-3.5 h-3.5" /> },
          { label: 'Delivered', href: '/admin/orders?status=delivered', icon: <Truck className="w-3.5 h-3.5" /> },
          { label: 'Cancelled', href: '/admin/orders?status=cancelled', icon: <Receipt className="w-3.5 h-3.5" /> },
        ],
      },
      { label: 'Order Refunds', href: '/admin/orders/refunds', icon: <RefreshCcw className="w-4 h-4" /> },
      { label: 'Flash Sales', href: '/admin/flash-sales', icon: <Zap className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Promotion Management',
    items: [
      { label: 'Campaigns', href: '/admin/promotions/campaigns', icon: <Megaphone className="w-4 h-4" /> },
      { label: 'Banners', href: '/admin/promotions/banners', icon: <Image className="w-4 h-4" /> },
      { label: 'Coupons', href: '/admin/promotions/coupons', icon: <Gift className="w-4 h-4" /> },
      { label: 'Push Notifications', href: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Product Management',
    items: [
      {
        label: 'Products',
        icon: <Package className="w-4 h-4" />,
        children: [
          { label: 'All Products', href: '/admin/products', icon: <List className="w-3.5 h-3.5" /> },
          { label: 'Add New', href: '/admin/products/new', icon: <PlusCircle className="w-3.5 h-3.5" /> },
          { label: 'Reviews', href: '/admin/products/reviews', icon: <Star className="w-3.5 h-3.5" /> },
        ],
      },
      { label: 'Categories', href: '/admin/categories', icon: <Layers className="w-4 h-4" /> },
      { label: 'Attributes', href: '/admin/attributes', icon: <Tag className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Store Management',
    items: [
      {
        label: 'Stores',
        icon: <Store className="w-4 h-4" />,
        children: [
          { label: 'All Stores', href: '/admin/stores', icon: <List className="w-3.5 h-3.5" /> },
          { label: 'Add New', href: '/admin/stores/new', icon: <PlusCircle className="w-3.5 h-3.5" /> },
          { label: 'Reviews', href: '/admin/stores/reviews', icon: <Star className="w-3.5 h-3.5" /> },
        ],
      },
    ],
  },
  {
    group: 'Delivery Management',
    items: [
      {
        label: 'Delivery Men',
        icon: <Truck className="w-4 h-4" />,
        children: [
          { label: 'All Delivery Men', href: '/admin/delivery', icon: <List className="w-3.5 h-3.5" /> },
          { label: 'Add New', href: '/admin/delivery/new', icon: <PlusCircle className="w-3.5 h-3.5" /> },
          { label: 'Reviews', href: '/admin/delivery/reviews', icon: <Star className="w-3.5 h-3.5" /> },
        ],
      },
    ],
  },
  {
    group: 'Customer Management',
    items: [
      { label: 'Customer List', href: '/admin/customers', icon: <Users className="w-4 h-4" /> },
      { label: 'Customer Wallet', href: '/admin/customers/wallet', icon: <Wallet className="w-4 h-4" /> },
      { label: 'Loyalty Points', href: '/admin/customers/loyalty', icon: <Star className="w-4 h-4" /> },
    ],
  },
  {
    group: 'User Management',
    items: [
      { label: 'Employee Roles', href: '/admin/employees/roles', icon: <Shield className="w-4 h-4" /> },
      { label: 'Employee List', href: '/admin/employees', icon: <UserCog className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Transactions & Reports',
    items: [
      { label: 'Transactions', href: '/admin/transactions', icon: <CreditCard className="w-4 h-4" /> },
      { label: 'Withdraw Requests', href: '/admin/withdrawals', icon: <Wallet className="w-4 h-4" /> },
      { label: 'Reports', href: '/admin/reports', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Business Settings',
    items: [
      {
        label: 'Settings',
        icon: <Settings className="w-4 h-4" />,
        children: [
          { label: 'Business Setup', href: '/admin/settings/business', icon: <Settings className="w-3.5 h-3.5" /> },
          { label: 'Zone Setup', href: '/admin/settings/zones', icon: <MapPin className="w-3.5 h-3.5" /> },
          { label: 'Module Setup', href: '/admin/settings/modules', icon: <Layers className="w-3.5 h-3.5" /> },
          { label: 'Pages & Social', href: '/admin/settings/pages', icon: <Globe className="w-3.5 h-3.5" /> },
          { label: 'Gallery', href: '/admin/settings/gallery', icon: <Image className="w-3.5 h-3.5" /> },
        ],
      },
      { label: 'System Config', href: '/admin/settings/system', icon: <Database className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Support & AI',
    items: [
      { label: 'Messaging', href: '/admin/messaging', icon: <Bell className="w-4 h-4" /> },
      { label: 'WhatsApp Orders', href: '/admin/whatsapp', icon: <Monitor className="w-4 h-4" /> },
      { label: 'AI Tools', href: '/admin/ai-tools', icon: <Zap className="w-4 h-4" /> },
      { label: 'File Manager', href: '/admin/file-manager', icon: <Package className="w-4 h-4" /> },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: <ClipboardList className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Ride Share & Rental',
    items: [
      { label: 'RSR Dashboard', href: '/admin/ride-share', icon: <BarChart3 className="w-4 h-4" /> },
      {
        label: 'Rides',
        icon: <Car className="w-4 h-4" />,
        children: [
          { label: 'All Rides', href: '/admin/ride-share/rides', icon: <List className="w-3.5 h-3.5" /> },
          { label: 'Active Rides', href: '/admin/ride-share/rides?status=ongoing', icon: <Zap className="w-3.5 h-3.5" /> },
        ],
      },
      {
        label: 'Rentals',
        icon: <Store className="w-4 h-4" />,
        children: [
          { label: 'All Rentals', href: '/admin/ride-share/rentals', icon: <List className="w-3.5 h-3.5" /> },
          { label: 'Active Bookings', href: '/admin/ride-share/rentals?status=active', icon: <Zap className="w-3.5 h-3.5" /> },
          { label: 'Fleet / Vehicles', href: '/admin/ride-share/vehicles', icon: <Car className="w-3.5 h-3.5" /> },
        ],
      },
      { label: 'Drivers / Providers', href: '/admin/ride-share/drivers', icon: <Users className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Service Marketplace',
    items: [
      { label: 'Service Dashboard', href: '/admin/services', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Service Providers', href: '/admin/services/providers', icon: <Store className="w-4 h-4" /> },
      { label: 'Bookings', href: '/admin/services/bookings', icon: <ClipboardList className="w-4 h-4" /> },
      { label: 'Service Packages', href: '/admin/services/packages', icon: <Layers className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Parcel & Logistics',
    items: [
      { label: 'Parcel Dashboard', href: '/admin/parcel', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'All Shipments', href: '/admin/parcel/shipments', icon: <Package className="w-4 h-4" /> },
      { label: 'Riders / Fleet', href: '/admin/parcel/riders', icon: <Truck className="w-4 h-4" /> },
      { label: 'Logistics Settings', href: '/admin/parcel/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
  {
    group: 'Affiliate System',
    items: [
      { label: 'Affiliate Stats', href: '/admin/affiliate', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Affiliate List', href: '/admin/affiliate/users', icon: <Users className="w-4 h-4" /> },
      { label: 'Commissions', href: '/admin/affiliate/commissions', icon: <CreditCard className="w-4 h-4" /> },
      { label: 'Payout Requests', href: '/admin/affiliate/payouts', icon: <Wallet className="w-4 h-4" />, badge: 3, badgeColor: '#f59e0b' },
    ],
  },
  {
    group: 'Classified Marketplace',
    items: [
      { label: 'CLF Dashboard', href: '/admin/classified', icon: <BarChart3 className="w-4 h-4" /> },
      {
        label: 'Ad Management',
        icon: <ClipboardList className="w-4 h-4" />,
        badge: 12,
        badgeColor: '#FF6B35',
        children: [
          { label: 'All Ads', href: '/admin/classified/ads', icon: <List className="w-3.5 h-3.5" /> },
          { label: 'Pending Review', href: '/admin/classified/ads?status=pending_review', icon: <ClipboardList className="w-3.5 h-3.5" />, badge: 12, badgeColor: '#FF6B35' },
          { label: 'Active Ads', href: '/admin/classified/ads?status=active', icon: <Zap className="w-3.5 h-3.5" /> },
          { label: 'Rejected', href: '/admin/classified/ads?status=rejected', icon: <Shield className="w-3.5 h-3.5" /> },
        ],
      },
      {
        label: 'Categories & Fields',
        icon: <Layers className="w-4 h-4" />,
        children: [
          { label: 'Categories', href: '/admin/classified/categories', icon: <Layers className="w-3.5 h-3.5" /> },
          { label: 'Locations', href: '/admin/classified/locations', icon: <MapPin className="w-3.5 h-3.5" /> },
        ],
      },
      { label: 'Sellers', href: '/admin/classified/sellers', icon: <Store className="w-4 h-4" /> },
      { label: 'Memberships', href: '/admin/classified/memberships', icon: <Star className="w-4 h-4" /> },
      { label: 'Promotions', href: '/admin/classified/promotions', icon: <Megaphone className="w-4 h-4" /> },
      { label: 'Reports / Flags', href: '/admin/classified/reports', icon: <Shield className="w-4 h-4" />, badge: 5, badgeColor: '#dc2626' },
      { label: 'Chat Moderation', href: '/admin/classified/chat-moderation', icon: <Bell className="w-4 h-4" /> },
      { label: 'CLF Settings', href: '/admin/classified/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

interface SidebarNavItemProps {
  item: NavItem;
  depth?: number;
  collapsed?: boolean;
}

function SidebarNavItem({ item, depth = 0, collapsed = false }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + '/') : false;
  const hasChildren = item.children && item.children.length > 0;
  const [open, setOpen] = useState(
    hasChildren && item.children!.some((c) => c.href && pathname.startsWith(c.href))
  );

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          title={collapsed ? item.label : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius)] text-[13px] font-medium transition-all duration-150 cursor-pointer',
            'text-[rgba(255,255,255,0.75)] hover:bg-[var(--sidebar-accent)] hover:text-white',
            open && 'bg-[var(--sidebar-accent)] text-white'
          )}
        >
          {item.icon && (
            <span className="shrink-0 w-4 h-4 flex items-center justify-center">{item.icon}</span>
          )}
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              <span className="shrink-0">
                {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
            </>
          )}
        </button>
        {!collapsed && open && (
          <div className="mt-0.5 ml-7 space-y-0.5 border-l border-[rgba(255,255,255,0.08)] pl-3">
            {item.children!.map((child, i) => (
              <SidebarNavItem key={i} item={child} depth={depth + 1} collapsed={collapsed} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-[var(--radius)] text-[13px] font-medium transition-all duration-150',
        depth === 0
          ? 'text-[rgba(255,255,255,0.75)] hover:bg-[var(--sidebar-accent)] hover:text-white'
          : 'text-[rgba(255,255,255,0.65)] hover:text-white',
        isActive && depth === 0 && 'bg-[var(--sidebar-active-bg)] text-[var(--primary)] border border-[var(--primary)]/20',
        isActive && depth > 0 && 'text-[var(--primary)]'
      )}
    >
      {item.icon && (
        <span
          className={cn(
            'shrink-0 flex items-center justify-center',
            depth === 0 ? 'w-4 h-4' : 'w-3.5 h-3.5'
          )}
        >
          {item.icon}
        </span>
      )}
      {!collapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
      {!collapsed && item.badge !== undefined && (
        <span
          className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: item.badgeColor || 'var(--primary)', color: 'white' }}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[var(--sidebar-background)] transition-all duration-300 overflow-hidden',
        collapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]'
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--sidebar-border)] shrink-0">
        <div
          className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 font-bold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, var(--primary), #0d8a40)' }}
        >
          AM
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-white truncate">Amana Mart</p>
            <p className="text-[11px] text-[rgba(255,255,255,0.5)] truncate">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 scrollbar-thin">
        {navigation.map((section, si) => (
          <div key={si} className={si > 0 ? 'mt-4' : ''}>
            {section.group && !collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
                {section.group}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item, ii) => (
                <SidebarNavItem key={ii} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 px-2.5 py-3 border-t border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            AD
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-white truncate">Admin</p>
              <p className="text-[11px] text-[rgba(255,255,255,0.5)] truncate">admin@amanamart.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

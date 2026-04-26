import { 
  ShoppingBasket, 
  Pill, 
  UtensilsCrossed, 
  ShoppingBag, 
  Package, 
  Car, 
  Wrench, 
  Megaphone 
} from 'lucide-react';
import { ModuleType } from '@/context/ModuleContext';

export interface ModuleConfig {
  id: ModuleType;
  label: string;
  icon: any;
  color: string;
  bg: string;
  accent: string;
  description: string;
  href: string;
}

export const MODULES: ModuleConfig[] = [
  { 
    id: 'grocery', 
    label: 'Grocery', 
    icon: ShoppingBasket, 
    color: '#1aab50', 
    bg: '#e8f9ee', 
    accent: '#1aab50',
    description: 'Fresh groceries delivered',
    href: '/store/category/grocery'
  },
  { 
    id: 'pharmacy', 
    label: 'Pharmacy', 
    icon: Pill, 
    color: '#ef4444', 
    bg: '#fee2e2', 
    accent: '#ef4444',
    description: 'Medicines & healthcare',
    href: '/store/category/pharmacy'
  },
  { 
    id: 'food', 
    label: 'Food', 
    icon: UtensilsCrossed, 
    color: '#f59e0b', 
    bg: '#fef3c7', 
    accent: '#f59e0b',
    description: 'Delicious meals',
    href: '/store/category/food'
  },
  { 
    id: 'shop', 
    label: 'Shop', 
    icon: ShoppingBag, 
    color: '#3b82f6', 
    bg: '#dbeafe', 
    accent: '#3b82f6',
    description: 'E-commerce & more',
    href: '/store'
  },
  { 
    id: 'parcel', 
    label: 'Parcel', 
    icon: Package, 
    color: '#f97316', 
    bg: '#ffedd5', 
    accent: '#f97316',
    description: 'Send & receive parcels',
    href: '/parcel'
  },
  { 
    id: 'ride', 
    label: 'Express', 
    icon: Car, 
    color: '#111827', 
    bg: '#f3f4f6', 
    accent: '#111827',
    description: 'Ride sharing sharing',
    href: '/ride'
  },
  { 
    id: 'service', 
    label: 'Service', 
    icon: Wrench, 
    color: '#0891b2', 
    bg: '#cffafe', 
    accent: '#0891b2',
    description: 'Professional services',
    href: '/service'
  },
  { 
    id: 'classified', 
    label: 'Classified', 
    icon: Megaphone, 
    color: '#FF6B35', 
    bg: '#fff7ed', 
    accent: '#FF6B35',
    description: 'Buy & sell anything',
    href: '/classified'
  },
];

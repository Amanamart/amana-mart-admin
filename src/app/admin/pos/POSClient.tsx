'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, ShoppingCart, Trash2, CreditCard, Barcode, User, Package } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface POSProduct { id: string; name: string; sku: string; price: number; stock: number; category: string; emoji: string; }
interface CartItem extends POSProduct { qty: number; }

const POS_PRODUCTS: POSProduct[] = [
  { id: 'p1', name: 'Organic Basmati Rice 5kg', sku: 'GR-001', price: 480, stock: 45, category: 'Grocery', emoji: '🌾' },
  { id: 'p2', name: 'Fresh Milk 1L', sku: 'GR-002', price: 95, stock: 120, category: 'Dairy', emoji: '🥛' },
  { id: 'p3', name: 'Paracetamol 500mg', sku: 'PH-001', price: 80, stock: 500, category: 'Medicine', emoji: '💊' },
  { id: 'p4', name: 'Samsung M34 Cover', sku: 'EC-001', price: 350, stock: 23, category: 'Electronics', emoji: '📱' },
  { id: 'p5', name: 'Mango Pickle 500g', sku: 'GR-003', price: 180, stock: 67, category: 'Grocery', emoji: '🫙' },
  { id: 'p6', name: 'Vitamin C 1000mg', sku: 'PH-002', price: 450, stock: 89, category: 'Medicine', emoji: '🍋' },
  { id: 'p7', name: 'Cotton Kurti Set', sku: 'FS-001', price: 2200, stock: 34, category: 'Fashion', emoji: '👗' },
  { id: 'p8', name: 'Fresh Eggs 12pcs', sku: 'GR-004', price: 160, stock: 200, category: 'Dairy', emoji: '🥚' },
  { id: 'p9', name: 'Hand Sanitizer 500ml', sku: 'PH-003', price: 220, stock: 78, category: 'Health', emoji: '🧴' },
  { id: 'p10', name: 'Wireless Earbuds', sku: 'EC-002', price: 3500, stock: 12, category: 'Electronics', emoji: '🎧' },
  { id: 'p11', name: 'Mineral Water 2L', sku: 'GR-005', price: 40, stock: 500, category: 'Beverages', emoji: '💧' },
  { id: 'p12', name: 'Chicken Curry Paste', sku: 'GR-006', price: 120, stock: 45, category: 'Grocery', emoji: '🍛' },
];

const CATEGORIES = ['All', 'Grocery', 'Dairy', 'Medicine', 'Electronics', 'Fashion', 'Health', 'Beverages'];

export function POSClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const filtered = useMemo(() => {
    let list = POS_PRODUCTS;
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [search, category]);

  const addToCart = (product: POSProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = Math.round(subtotal * (discount / 100));
  const total = subtotal - discountAmt;

  return (
    <div className="flex h-[calc(100vh-var(--topbar-height)-2rem)] gap-4 animate-fade-in overflow-hidden">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-3 mb-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products or scan barcode..."
              className="w-full h-9 pl-9 pr-3 rounded-[var(--radius)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)]" />
          </div>
          <button className="h-9 px-3 rounded-[var(--radius)] border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] flex items-center gap-1.5 text-[12px] font-medium transition-colors">
            <Barcode className="w-4 h-4" /> Scan
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`shrink-0 text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all ${category === cat ? 'bg-[var(--secondary)] text-white' : 'bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--secondary)] hover:text-[var(--secondary)]'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pb-3">
            {filtered.map(product => (
              <div key={product.id} onClick={() => addToCart(product)}
                className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-3 cursor-pointer hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)] transition-all group">
                <div className="text-3xl mb-2 text-center group-hover:scale-110 transition-transform">{product.emoji}</div>
                <p className="text-[12px] font-semibold text-[var(--foreground)] leading-tight mb-1">{product.name}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] mb-2 font-mono">{product.sku}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[var(--primary)]">{formatCurrency(product.price)}</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Stock: {product.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart */}
      <div className="w-80 shrink-0 bg-white rounded-[var(--radius-lg)] border border-[var(--border)] flex flex-col overflow-hidden">
        {/* Cart Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[var(--secondary)]" />
            <p className="text-[14px] font-bold text-[var(--foreground)]">Cart ({cart.length})</p>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--muted-foreground)]">
            <User className="w-3.5 h-3.5" />
            <span>Walk-in Customer</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Package className="w-10 h-10 text-[var(--border)] mb-2" />
              <p className="text-[13px] text-[var(--muted-foreground)]">Cart is empty</p>
              <p className="text-[11px] text-[var(--muted-foreground)]">Click products to add</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="bg-[#fafafa] rounded-[var(--radius)] p-2.5 flex items-center gap-2">
              <span className="text-xl shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium truncate">{item.name}</p>
                <p className="text-[11px] text-[var(--primary)] font-bold">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 rounded bg-[var(--border)] flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"><Minus className="w-3 h-3" /></button>
                <span className="text-[12px] font-bold w-5 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 rounded bg-[var(--border)] flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors"><Plus className="w-3 h-3" /></button>
              </div>
              <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="w-5 h-5 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t border-[var(--border)] p-4 space-y-3">
          <div className="space-y-1.5 text-[13px]">
            <div className="flex items-center justify-between text-[var(--muted-foreground)]">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Discount</span>
              <div className="flex items-center gap-1">
                <input type="number" value={discount} onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-12 h-6 px-2 text-[12px] rounded border border-[var(--border)] text-center focus:outline-none focus:border-[var(--primary)]" />
                <span className="text-[12px]">%</span>
                <span className="text-red-500 font-medium">-{formatCurrency(discountAmt)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between font-bold text-[15px] pt-2 border-t border-[var(--border)]">
              <span>Total</span><span className="text-[var(--primary)]">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="grid grid-cols-3 gap-1.5">
            {[{ key: 'cash', label: '💵 Cash' }, { key: 'bkash', label: '🔴 bKash' }, { key: 'card', label: '💳 Card' }].map(m => (
              <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                className={`text-[11px] font-semibold py-2 rounded-[var(--radius)] border transition-all ${paymentMethod === m.key ? 'bg-[var(--secondary)] text-white border-[var(--secondary)]' : 'bg-white border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--secondary)]'}`}>
                {m.label}
              </button>
            ))}
          </div>

          <Button variant="secondary" fullWidth disabled={cart.length === 0} leftIcon={<CreditCard className="w-4 h-4" />}>
            Complete Sale — {formatCurrency(total)}
          </Button>
        </div>
      </div>
    </div>
  );
}

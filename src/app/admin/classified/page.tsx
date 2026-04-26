'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, Users, BarChart2, Megaphone, Shield, Star, Tag, ChevronRight, Check, X } from 'lucide-react';

const STATS = [
  { label: 'Total Ads', value: '12,480', change: '+234 today', icon: <BarChart2 size={22} />, color: '#FF6B35', bg: '#fff5f0' },
  { label: 'Pending Review', value: '47', change: 'Needs action', icon: <Clock size={22} />, color: '#f59e0b', bg: '#fffbeb', alert: true },
  { label: 'Active Ads', value: '9,842', change: '+1.2% this week', icon: <CheckCircle size={22} />, color: '#1aab50', bg: '#f0fdf4' },
  { label: 'Active Sellers', value: '3,241', change: '+89 this week', icon: <Users size={22} />, color: '#2563eb', bg: '#eff6ff' },
  { label: 'Total Reports', value: '28', change: '5 unreviewed', icon: <Shield size={22} />, color: '#dc2626', bg: '#fef2f2' },
  { label: 'Ad Revenue', value: '৳84,500', change: 'This month', icon: <TrendingUp size={22} />, color: '#7c3aed', bg: '#f5f3ff' },
];

const PENDING_ADS = [
  { id: 'a1', title: 'iPhone 15 Pro Max 256GB', category: 'Mobile Phones', seller: 'Rahim Ahmed', location: 'Dhaka', price: 155000, image: '📱', createdAt: '2 hours ago' },
  { id: 'a2', title: 'Toyota Corolla 2020 Full Option', category: 'Cars', seller: 'Karim Motors', location: 'Chattogram', price: 3200000, image: '🚗', createdAt: '3 hours ago' },
  { id: 'a3', title: '3BHK Flat for Rent - Gulshan', category: 'Property', seller: 'BD Realty', location: 'Dhaka', price: 65000, image: '🏢', createdAt: '5 hours ago' },
  { id: 'a4', title: 'MacBook Pro M3 14" Mint Condition', category: 'Laptops', seller: 'TechBD Store', location: 'Dhaka', price: 220000, image: '💻', createdAt: '6 hours ago' },
  { id: 'a5', title: 'Suzuki Gixxer SF 2023', category: 'Motorbikes', seller: 'Moto Palace', location: 'Sylhet', price: 185000, image: '🏍️', createdAt: '8 hours ago' },
];

const RECENT_REPORTS = [
  { id: 'r1', adTitle: 'Free iPhone 13 Giveaway', reason: 'Fraud / Scam', reporter: 'User #2841', status: 'pending', createdAt: '1 hour ago' },
  { id: 'r2', adTitle: 'Used Samsung TV', reason: 'Wrong Category', reporter: 'User #1234', status: 'reviewed', createdAt: '4 hours ago' },
  { id: 'r3', adTitle: 'Gold Ring 22 Karat', reason: 'Fake Price', reporter: 'User #9823', status: 'pending', createdAt: '6 hours ago' },
];

const TOP_CATEGORIES = [
  { name: 'Mobiles', count: 2840, pct: 85, icon: '📱' },
  { name: 'Vehicles', count: 3150, pct: 94, icon: '🚗' },
  { name: 'Property', count: 2200, pct: 66, icon: '🏠' },
  { name: 'Jobs', count: 4500, pct: 100, icon: '💼' },
  { name: 'Electronics', count: 1920, pct: 58, icon: '💻' },
];

function formatPrice(p: number) {
  if (p >= 100000) return `৳${(p / 100000).toFixed(1)}L`;
  return `৳${(p / 1000).toFixed(0)}K`;
}

export default function AdminClassifiedDashboard() {
  const [approving, setApproving] = useState<Set<string>>(new Set());

  const handleApprove = (id: string) => setApproving(prev => new Set([...prev, id]));
  const handleReject = (id: string) => setApproving(prev => new Set([...prev, id]));

  return (
    <div style={{ padding: '28px 32px', background: '#f8f9fb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a2e' }}>Classified Marketplace</h1>
          <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>Monitor and manage all classified ads and sellers</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/classified/ads?status=pending_review" style={{
            padding: '10px 20px', background: '#FF6B35', color: '#fff',
            borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Clock size={16} /> Review Queue (47)
          </Link>
          <Link href="/classified" target="_blank" style={{
            padding: '10px 20px', background: '#fff', color: '#555',
            borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14,
            border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Eye size={16} /> View Live Site
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {STATS.map((stat, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 16, padding: '20px 24px',
            border: stat.alert ? '1.5px solid #f59e0b' : '1px solid #e8e8e8',
            display: 'flex', gap: 16, alignItems: 'center',
            boxShadow: stat.alert ? '0 0 0 3px rgba(245,158,11,0.1)' : 'none',
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#1a1a2e', lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{stat.label}</p>
              <p style={{ fontSize: 12, color: stat.alert ? '#f59e0b' : '#888', fontWeight: stat.alert ? 700 : 400, marginTop: 2 }}>{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 24 }}>
        {/* Pending Ads Table */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} style={{ color: '#f59e0b' }} /> Pending Review
              <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 12, fontWeight: 800, padding: '2px 10px', borderRadius: 20 }}>47</span>
            </h2>
            <Link href="/admin/classified/ads?status=pending_review" style={{ color: '#FF6B35', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>
          {PENDING_ADS.map(ad => (
            <div key={ad.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #f5f5f5', opacity: approving.has(ad.id) ? 0.4 : 1, transition: 'opacity 0.3s' }}>
              <div style={{ width: 44, height: 44, background: '#f5f5ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{ad.image}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: '#222', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ad.title}</p>
                <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{ad.category} · {ad.seller} · {ad.location} · {formatPrice(ad.price)}</p>
              </div>
              <span style={{ fontSize: 11, color: '#999', flexShrink: 0 }}>{ad.createdAt}</span>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => handleApprove(ad.id)} title="Approve" style={{
                  width: 32, height: 32, borderRadius: 8, border: 'none',
                  background: '#dcfce7', color: '#166534', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Check size={16} /></button>
                <button onClick={() => handleReject(ad.id)} title="Reject" style={{
                  width: 32, height: 32, borderRadius: 8, border: 'none',
                  background: '#fee2e2', color: '#991b1b', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><X size={16} /></button>
                <Link href={`/admin/classified/ads/${ad.id}`} title="View" style={{
                  width: 32, height: 32, borderRadius: 8, border: '1px solid #e0e0e0',
                  background: '#fff', color: '#555', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
                }}><Eye size={16} /></Link>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top Categories */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e8e8', padding: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e', marginBottom: 16 }}>Top Categories</h2>
            {TOP_CATEGORIES.map(cat => (
              <div key={cat.name} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{cat.icon} {cat.name}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>{cat.count.toLocaleString()} ads</span>
                </div>
                <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${cat.pct}%`, background: 'linear-gradient(90deg, #FF6B35, #F7931E)', borderRadius: 3, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
            <Link href="/admin/classified/categories" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: '#FF6B35', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Manage Categories →
            </Link>
          </div>

          {/* Recent Reports */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e8e8', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={16} style={{ color: '#dc2626' }} /> Recent Reports
              </h2>
              <Link href="/admin/classified/reports" style={{ color: '#FF6B35', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>View All</Link>
            </div>
            {RECENT_REPORTS.map(r => (
              <div key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 2 }}>{r.adTitle}</p>
                    <p style={{ fontSize: 12, color: '#888' }}>{r.reason} · {r.reporter}</p>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                    background: r.status === 'pending' ? '#fee2e2' : '#f0fdf4',
                    color: r.status === 'pending' ? '#dc2626' : '#166534',
                  }}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e8e8', padding: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e', marginBottom: 14 }}>Quick Actions</h2>
            {[
              { href: '/admin/classified/categories', label: 'Seed Categories', icon: <Tag size={16} />, color: '#1aab50' },
              { href: '/admin/classified/locations', label: 'Seed BD Locations', icon: <Shield size={16} />, color: '#2563eb' },
              { href: '/admin/classified/memberships', label: 'Manage Plans', icon: <Star size={16} />, color: '#7c3aed' },
              { href: '/admin/classified/promotions', label: 'Promo Packages', icon: <Megaphone size={16} />, color: '#FF6B35' },
              { href: '#', label: 'Seed Initial Data', icon: <CheckCircle size={16} />, color: '#1aab50', onClick: async () => {
                if(confirm('Seed initial categories and locations?')) {
                  try {
                    await fetch('/api/classified/admin/categories/seed', { method: 'POST' });
                    alert('Seeding started!');
                  } catch(e) { alert('Failed to seed'); }
                }
              }},
            ].map(a => (
              <Link key={a.href} href={a.href} 
                onClick={(e) => {
                  if(a.onClick) {
                    e.preventDefault();
                    a.onClick();
                  }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 10, marginBottom: 6, textDecoration: 'none',
                  background: '#f9f9f9', color: '#333', fontSize: 14, fontWeight: 500,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f0f0f0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f9f9f9'; }}
              >
                <span style={{ color: a.color }}>{a.icon}</span>
                {a.label}
                <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#ccc' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

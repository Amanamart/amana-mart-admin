'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Check, X, Ban, Star, Filter, ChevronDown } from 'lucide-react';

const MOCK_ADS = Array.from({ length: 20 }, (_, i) => ({
  id: `ad-${i + 1}`,
  title: ['iPhone 15 Pro Max', 'Toyota Corolla', '3BHK Flat Gulshan', 'MacBook Pro M3', 'Samsung S24 Ultra', 'Honda CB300R', 'Nikon D850', 'LG Refrigerator', 'Sofa Set 5 Seater', 'Office Plot Rent', 'Senior Dev Job', 'Dell XPS 15', 'Honda City 2023', 'LED TV 65"', 'Yamaha R15 V4', 'AC 1.5 Ton', 'Washing Machine LG', 'Persian Cat Female', 'Trek Road Bike', 'Electric Guitar'][i],
  seller: ['Rahim Ahmed', 'Karim Motors', 'BD Realty', 'TechBD Store', 'Mobile Hub', 'Moto Palace', 'Photo Studio', 'Appliance Zone', 'Furniture BD', 'Property BD', 'HR Portal', 'Tech Emporium', 'Auto Gallery', 'Electronics BD', 'Moto World', 'Cool Zone', 'Wash & Clean', 'Pet Paradise', 'Cycle World', 'Music Land'][i],
  category: ['Mobiles', 'Cars', 'Property', 'Electronics', 'Mobiles', 'Motorbikes', 'Cameras', 'Appliances', 'Furniture', 'Property', 'Jobs', 'Electronics', 'Cars', 'Electronics', 'Motorbikes', 'Appliances', 'Appliances', 'Pets', 'Sports', 'Music'][i],
  price: [155000, 3500000, 65000, 220000, 115000, 245000, 185000, 58000, 35000, 45000, 0, 145000, 3800000, 95000, 210000, 62000, 48000, 15000, 28000, 22000][i],
  status: ['pending_review', 'active', 'active', 'pending_review', 'active', 'rejected', 'active', 'active', 'paused', 'pending_review', 'active', 'active', 'active', 'pending_review', 'active', 'active', 'active', 'active', 'active', 'blocked'][i],
  location: ['Dhaka', 'Chattogram', 'Dhaka', 'Dhaka', 'Dhaka', 'Sylhet', 'Dhaka', 'Dhaka', 'Rajshahi', 'Dhaka', 'Remote', 'Dhaka', 'Chattogram', 'Dhaka', 'Sylhet', 'Gazipur', 'Dhaka', 'Dhaka', 'Dhaka', 'Chattogram'][i],
  image: ['📱', '🚗', '🏢', '💻', '📱', '🏍️', '📷', '🧊', '🛋️', '🏢', '💼', '💻', '🚗', '📺', '🏍️', '❄️', '🫧', '🐱', '🚲', '🎸'][i],
  views: Math.floor(Math.random() * 2000),
  reports: Math.floor(Math.random() * 5),
  isFeatured: i % 7 === 0,
  createdAt: `2026-04-${(i + 1).toString().padStart(2, '0')}`,
}));

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: '#dcfce7', color: '#166534', label: 'Active' },
  pending_review: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
  paused: { bg: '#dbeafe', color: '#1e3a8a', label: 'Paused' },
  blocked: { bg: '#f3f4f6', color: '#374151', label: 'Blocked' },
};

export default function AdminClassifiedAdsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = MOCK_ADS.filter(ad => {
    const matchSearch = ad.title.toLowerCase().includes(search.toLowerCase()) || ad.seller.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || ad.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: '28px 32px', background: '#f8f9fb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e' }}>Ad Management</h1>
          <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>Review, approve, and moderate all classified ads</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'All', value: 'all' },
            { label: 'Pending', value: 'pending_review' },
            { label: 'Active', value: 'active' },
            { label: 'Rejected', value: 'rejected' },
            { label: 'Blocked', value: 'blocked' },
          ].map(f => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: statusFilter === f.value ? '#FF6B35' : '#fff',
              color: statusFilter === f.value ? '#fff' : '#666',
              cursor: 'pointer', border: statusFilter === f.value ? 'none' : '1px solid #e0e0e0',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '14px 20px', border: '1px solid #e8e8e8', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Search size={18} style={{ color: '#999' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, seller name..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#333' }} />
        <p style={{ fontSize: 13, color: '#888', flexShrink: 0 }}>{filtered.length} ads found</p>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #e8e8e8' }}>
              {['Ad', 'Category', 'Seller', 'Price', 'Location', 'Status', 'Views', 'Reports', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ad, i) => {
              const ss = STATUS_STYLES[ad.status] || STATUS_STYLES.active;
              return (
                <tr key={ad.id} style={{ borderBottom: '1px solid #f5f5f5', transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#fafafa'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#fff'; }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, background: '#f5f5ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{ad.image}</div>
                      <div>
                        <p style={{ fontWeight: 600, color: '#222', fontSize: 13, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ad.title}</p>
                        <p style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{ad.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>{ad.category}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>{ad.seller}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#1aab50' }}>
                    {ad.price === 0 ? 'Negotiable' : `৳${(ad.price / 1000).toFixed(0)}K`}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>{ad.location}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{ss.label}</span>
                    {ad.isFeatured && <span style={{ display: 'block', marginTop: 4, background: '#dbeafe', color: '#1d4ed8', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>FEATURED</span>}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#555', textAlign: 'center' }}>{ad.views}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {ad.reports > 0 ? (
                      <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{ad.reports}</span>
                    ) : <span style={{ color: '#ccc', fontSize: 13 }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {ad.status === 'pending_review' && (
                        <>
                          <button title="Approve" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: '#dcfce7', color: '#166534', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={14} /></button>
                          <button title="Reject" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
                        </>
                      )}
                      <Link href={`/admin/classified/ads/${ad.id}`} title="View" style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #e0e0e0', background: '#fff', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><Eye size={14} /></Link>
                      <button title="Feature/Unfeature" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: ad.isFeatured ? '#dbeafe' : '#f3f4f6', color: ad.isFeatured ? '#1d4ed8' : '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star size={14} /></button>
                      <button title="Block" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: '#f3f4f6', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ban size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {[1, 2, 3, 4, 5].map(p => (
          <button key={p} style={{
            padding: '8px 16px', borderRadius: 8, border: p === 1 ? 'none' : '1px solid #e0e0e0',
            background: p === 1 ? '#FF6B35' : '#fff', color: p === 1 ? '#fff' : '#555',
            fontWeight: p === 1 ? 700 : 400, cursor: 'pointer', fontSize: 14,
          }}>{p}</button>
        ))}
      </div>
    </div>
  );
}

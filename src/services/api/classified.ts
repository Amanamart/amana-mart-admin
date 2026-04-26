const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const classifiedService = {
  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_URL}/classified/categories`);
    if (!res.ok) return [];
    return res.json();
  },
  
  // Locations
  getLocations: async () => {
    const res = await fetch(`${API_URL}/classified/locations`);
    if (!res.ok) return [];
    return res.json();
  },

  // Ads
  getAds: async (params: any) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => searchParams.append(key, params[key]));
    
    const res = await fetch(`${API_URL}/classified/ads?${searchParams.toString()}`);
    if (!res.ok) return { ads: [], total: 0 };
    return res.json();
  },
  
  getAdBySlug: async (slug: string) => {
    const res = await fetch(`${API_URL}/classified/ads/${slug}`);
    if (!res.ok) return null;
    return res.json();
  },
  
  createAd: async (data: any) => {
    const res = await fetch(`${API_URL}/classified/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
  // Membership
  getMembershipPlans: async () => {
    const res = await fetch(`${API_URL}/classified/membership/plans`);
    if (!res.ok) return [];
    return res.json();
  },
};

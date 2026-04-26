const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error('API Error');
  return response.json();
};

export const getDashboardStats = () => fetcher('/admin/stats');
export const getOrderChartData = (days = 7) => fetcher(`/admin/charts/orders?days=${days}`);
export const getZones = () => fetcher('/admin/zones');
export const getStores = () => fetcher('/admin/stores');
export const createZone = (data: any) => fetcher('/admin/zones', { method: 'POST', body: JSON.stringify(data) });

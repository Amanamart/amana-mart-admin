import { apiClient } from './client';

export const adminService = {
  // Dashboard
  getDashboardStats: () => apiClient('/admin/stats'),
  getOrderChartData: (days = 7) => apiClient('/admin/charts/orders', { params: { days } }),
  
  // Zones
  getZones: () => apiClient('/admin/zones'),
  createZone: (data: any) => apiClient('/admin/zones', { method: 'POST', body: JSON.stringify(data) }),
  updateZone: (id: string, data: any) => apiClient(`/admin/zones/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteZone: (id: string) => apiClient(`/admin/zones/${id}`, { method: 'DELETE' }),

  // Modules
  getModules: () => apiClient('/admin/modules'),
  updateModule: (id: string, data: any) => apiClient(`/admin/modules/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Stores
  getStores: (params?: any) => apiClient('/admin/stores', { params }),
  getStoreDetails: (id: string) => apiClient(`/admin/stores/${id}`),
  updateStoreStatus: (id: string, status: string) => apiClient(`/admin/stores/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Products
  getProducts: (params?: any) => apiClient('/admin/products', { params }),
  getProductDetails: (id: string) => apiClient(`/admin/products/${id}`),
  updateProduct: (id: string, data: any) => apiClient(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => apiClient(`/admin/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: (params?: any) => apiClient('/admin/categories', { params }),
  createCategory: (data: any) => apiClient('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  
  // Orders
  getOrders: (params?: any) => apiClient('/admin/orders', { params }),
  getOrderDetails: (id: string) => apiClient(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => apiClient(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Delivery Men
  getDeliveryMen: (params?: any) => apiClient('/admin/delivery', { params }),
  // Reports
  getReportsOverview: () => apiClient('/admin/reports/overview'),
};


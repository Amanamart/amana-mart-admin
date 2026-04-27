import { useQuery } from '@tanstack/react-query';
import * as AdminApi from '@/services/api/admin';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: AdminApi.adminService.getDashboardStats,
  });
};

export const useOrderChart = (days = 7) => {
  return useQuery({
    queryKey: ['order-chart', days],
    queryFn: () => AdminApi.adminService.getOrderChartData(days),
  });
};

export const useReportsOverview = () => {
  return useQuery({
    queryKey: ['reports-overview'],
    queryFn: AdminApi.adminService.getReportsOverview,
  });
};

export const useProducts = (params?: any) => {
  return useQuery({
    queryKey: ['admin-products', params],
    queryFn: () => AdminApi.adminService.getProducts(params),
  });
};

export const useStores = (params?: any) => {
  return useQuery({
    queryKey: ['admin-stores', params],
    queryFn: () => AdminApi.adminService.getStores(params),
  });
};

export const useCategories = (params?: any) => {
  return useQuery({
    queryKey: ['admin-categories', params],
    queryFn: () => AdminApi.adminService.getCategories(params),
  });
};

export const useModules = () => {
  return useQuery({
    queryKey: ['admin-modules'],
    queryFn: AdminApi.adminService.getModules,
  });
};

export const useOrders = (params?: any) => {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => AdminApi.adminService.getOrders(params),
  });
};

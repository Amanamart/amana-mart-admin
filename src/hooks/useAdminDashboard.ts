import { useQuery } from '@tanstack/react-query';
import * as AdminApi from '@/services/api/admin';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: AdminApi.getDashboardStats,
  });
};

export const useOrderChart = (days = 7) => {
  return useQuery({
    queryKey: ['order-chart', days],
    queryFn: () => AdminApi.getOrderChartData(days),
  });
};

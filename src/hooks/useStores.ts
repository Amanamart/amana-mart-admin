import { useQuery } from '@tanstack/react-query';
import * as AdminApi from '@/services/api/admin';

export const useStores = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: AdminApi.getStores,
  });
};

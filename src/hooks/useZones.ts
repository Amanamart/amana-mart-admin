import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as AdminApi from '@/services/api/admin';

export const useZones = () => {
  return useQuery({
    queryKey: ['zones'],
    queryFn: AdminApi.getZones,
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminApi.createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
};

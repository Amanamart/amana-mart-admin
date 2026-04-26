import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useMedia(filters: any = {}) {
  return useQuery({
    queryKey: ['media', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const res = await fetch(`${API_URL}/media?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch media');
      return res.json();
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, folder = 'general' }: { file: File; folder?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch(`${API_URL}/media/upload`, {
        method: 'POST',
        // Note: fetch will automatically set the correct Content-Type for FormData
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload file');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/media/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete media');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

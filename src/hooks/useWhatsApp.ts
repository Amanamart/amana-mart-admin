import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useWhatsAppSessions() {
  return useQuery({
    queryKey: ['whatsapp-sessions'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/admin/whatsapp/sessions`);
      if (!res.ok) throw new Error('Failed to fetch WhatsApp sessions');
      return res.json();
    },
  });
}

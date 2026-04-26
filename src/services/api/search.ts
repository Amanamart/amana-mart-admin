const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const searchService = {
  globalSearch: async (params: { q: string; module?: string; zone?: string; limit?: number; page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.module) searchParams.append('module', params.module);
    if (params.zone) searchParams.append('zone', params.zone);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.page) searchParams.append('page', params.page.toString());

    const response = await fetch(`${API_URL}/search?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  visualSearch: async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    
    const response = await fetch(`${API_URL}/search/visual`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Visual search failed');
    return response.json();
  },
};

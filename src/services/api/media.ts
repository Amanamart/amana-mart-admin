const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const mediaService = {
  upload: async (file: File, folder: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const res = await fetch(`${API_URL}/media/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
  
  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/media/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Delete failed');
    return res.json();
  }
};

'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, Search, FileText, Image as ImageIcon, 
  MoreVertical, Trash2, Download, ExternalLink, 
  FolderPlus, Filter, Grid, List as ListIcon,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/Modal';
import { useMedia, useUploadMedia, useDeleteMedia } from '@/hooks/useMedia';
import { formatNumber } from '@/lib/utils';

export function MediaClient() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useMedia({ search, folder: folder === 'all' ? '' : folder });
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const files = data?.files || [];

  // Helper to get local file URL
  const getFileUrl = (path: string) => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}/uploads/${path}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadMedia.mutateAsync({
        file,
        folder: folder === 'all' ? 'general' : folder
      });
      alert('File uploaded to local storage successfully!');
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file from local storage?')) return;

    try {
      await deleteMedia.mutateAsync(id);
    } catch (error: any) {
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <PageHeader
        title="File Manager (Local)"
        subtitle="Manage images and documents stored on your local server"
        actions={
          <div className="flex gap-2">
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <Button 
              variant="primary" 
              size="sm" 
              leftIcon={isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Local File'}
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-3 rounded-[var(--radius-lg)] border border-[var(--border)]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full h-9 pl-9 pr-4 rounded-[var(--radius)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--primary)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="h-9 px-3 rounded-[var(--radius)] border border-[var(--border)] text-sm bg-white focus:outline-none"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
          >
            <option value="all">All Folders</option>
            <option value="products">Products</option>
            <option value="banners">Banners</option>
            <option value="stores">Stores</option>
          </select>

          <div className="h-9 border-l border-[var(--border)] mx-1" />

          <div className="flex bg-slate-100 p-0.5 rounded-[var(--radius)]">
            <button 
              className={`p-1.5 rounded-[var(--radius-sm)] ${view === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              onClick={() => setView('grid')}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded-[var(--radius-sm)] ${view === 'list' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              onClick={() => setView('list')}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-[var(--primary)] opacity-40" />
          <p className="mt-4 text-[var(--muted-foreground)]">Loading your media library...</p>
        </div>
      ) : files.length === 0 ? (
        <Card className="py-20 text-center flex flex-col items-center border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium">No files found</h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-xs mx-auto mt-1">
            Try uploading a file to your local server.
          </p>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file: any) => (
            <Card key={file.id} padding="none" className="group overflow-hidden relative">
              <div className="aspect-square bg-slate-100 relative group-hover:opacity-90 transition-opacity">
                {file.mimeType.startsWith('image/') ? (
                  <img 
                    src={getFileUrl(file.path)}
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <FileText className="w-10 h-10 text-slate-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-500">{file.mimeType.split('/')[1]}</span>
                  </div>
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-red-600 transition-colors"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a 
                    href={getFileUrl(file.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-[var(--primary)] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="p-2 border-t border-[var(--border)]">
                <p className="text-[11px] font-medium text-[var(--foreground)] truncate" title={file.originalName}>
                  {file.originalName}
                </p>
                <p className="text-[9px] text-[var(--muted-foreground)] mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none" className="overflow-hidden border border-[var(--border)]">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-2 font-medium text-[var(--muted-foreground)] uppercase text-[11px]">Name</th>
                <th className="px-4 py-2 font-medium text-[var(--muted-foreground)] uppercase text-[11px]">Type</th>
                <th className="px-4 py-2 font-medium text-[var(--muted-foreground)] uppercase text-[11px]">Size</th>
                <th className="px-4 py-2 font-medium text-[var(--muted-foreground)] uppercase text-[11px]">Uploaded</th>
                <th className="px-4 py-2 font-medium text-[var(--muted-foreground)] uppercase text-[11px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {files.map((file: any) => (
                <tr key={file.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden">
                        {file.mimeType.startsWith('image/') ? (
                          <img 
                             src={getFileUrl(file.path)}
                             className="w-full h-full object-cover"
                          />
                        ) : <FileText className="w-4 h-4" />}
                      </div>
                      <span className="font-medium truncate max-w-[200px]">{file.originalName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)] uppercase text-[11px]">{file.mimeType.split('/')[1]}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">{(file.size / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">{new Date(file.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

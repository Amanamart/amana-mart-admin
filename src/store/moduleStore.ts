import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ModuleType = 
  | 'grocery' 
  | 'pharmacy' 
  | 'food' 
  | 'shop' 
  | 'parcel' 
  | 'ride' 
  | 'service' 
  | 'classified';

export interface ModuleConfig {
  id: ModuleType;
  label: string;
  icon: string;
  color: string;
  themeColor: string;
  href: string;
  description: string;
  status: 'active' | 'inactive';
  sortOrder: number;
}

interface ModuleState {
  activeModule: ModuleType;
  modules: ModuleConfig[];
  isLoading: boolean;
  error: string | null;
  
  setActiveModule: (module: ModuleType) => void;
  setModules: (modules: ModuleConfig[]) => void;
  fetchModules: () => Promise<void>;
  getModuleConfig: () => ModuleConfig | undefined;
}

const DEFAULT_MODULES: Record<ModuleType, ModuleConfig> = {
  grocery: { id: 'grocery', label: 'Grocery', icon: '🛒', color: '#1aab50', themeColor: '#1aab50', href: '/store/category/grocery', description: 'Fresh groceries', status: 'active', sortOrder: 1 },
  pharmacy: { id: 'pharmacy', label: 'Pharmacy', icon: '💊', color: '#ef4444', themeColor: '#ef4444', href: '/store/category/pharmacy', description: 'Medicines', status: 'active', sortOrder: 2 },
  food: { id: 'food', label: 'Food', icon: '🍕', color: '#f59e0b', themeColor: '#f59e0b', href: '/store/category/food', description: 'Restaurant food', status: 'active', sortOrder: 3 },
  shop: { id: 'shop', label: 'Shop', icon: '🛍️', color: '#3b82f6', themeColor: '#3b82f6', href: '/store', description: 'General shopping', status: 'active', sortOrder: 0 },
  parcel: { id: 'parcel', label: 'Courier', icon: '📦', color: '#f97316', themeColor: '#f97316', href: '/parcel', description: 'Parcel delivery', status: 'active', sortOrder: 4 },
  ride: { id: 'ride', label: 'Ride + Rental', icon: '🚗', color: '#005555', themeColor: '#005555', href: '/ride', description: 'Ride sharing', status: 'active', sortOrder: 5 },
  service: { id: 'service', label: 'Service', icon: '🛠️', color: '#8b5cf6', themeColor: '#8b5cf6', href: '/service', description: 'Home services', status: 'active', sortOrder: 6 },
  classified: { id: 'classified', label: 'Classified', icon: '📢', color: '#0891b2', themeColor: '#0891b2', href: '/classified', description: 'Buy & Sell', status: 'active', sortOrder: 7 },
};

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      activeModule: 'shop',
      modules: Object.values(DEFAULT_MODULES),
      isLoading: false,
      error: null,

      setActiveModule: (module) => set({ activeModule: module }),
      
      setModules: (modules) => set({ modules }),

      fetchModules: async () => {
        set({ isLoading: true, error: null });
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const res = await fetch(`${baseUrl}/modules/active`);
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
              const mappedModules = data.map((m: any) => ({
                id: m.type as ModuleType,
                label: m.name,
                icon: m.icon || '📦',
                color: m.themeColor || '#000000',
                themeColor: m.themeColor || '#000000',
                href: m.slug.startsWith('/') ? m.slug : `/${m.slug}`,
                description: m.description || '',
                status: m.status,
                sortOrder: m.sortOrder
              }));
              set({ modules: mappedModules });
            }
          }
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },

      getModuleConfig: () => {
        const { activeModule, modules } = get();
        return modules.find(m => m.id === activeModule);
      },
    }),
    {
      name: 'module-storage',
      partialize: (state) => ({ activeModule: state.activeModule }),
    }
  )
);

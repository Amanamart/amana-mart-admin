import { supabase } from '@/lib/supabase';
import { ModuleType } from '@/context/ModuleContext';

export const dbService = {
  // Fetch modules configuration
  async getModules() {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('is_active', true);
    if (error) throw error;
    return data;
  },

  // Fetch categories for a specific module
  async getCategories(moduleSlug: ModuleType) {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        modules!inner(slug)
      `)
      .eq('modules.slug', moduleSlug)
      .eq('is_active', true)
      .order('priority', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Fetch stores for a specific module and zone
  async getStores(moduleSlug: ModuleType, zoneId?: string) {
    let query = supabase
      .from('stores')
      .select(`
        *,
        modules!inner(slug)
      `)
      .eq('modules.slug', moduleSlug)
      .eq('is_open', true);
    
    if (zoneId) {
      query = query.eq('zone_id', zoneId);
    }

    const { data, error } = await query.order('rating', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Fetch products for a specific module
  async getProducts(moduleSlug: ModuleType, limit = 10) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        stores!inner(
          *,
          modules!inner(slug)
        )
      `)
      .eq('stores.modules.slug', moduleSlug)
      .eq('is_available', true)
      .limit(limit)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

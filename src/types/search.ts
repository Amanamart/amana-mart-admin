export interface SearchResponse {
  results: any[];
  total: number;
  page: number;
  limit: number;
  query: string;
  processingTimeMs: number;
  mode: 'meilisearch' | 'fallback_postgres';
}

export interface MeilisearchProductDoc {
  id: string;
  type: 'product';
  module: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  categoryId: string;
  categoryName_en: string;
  categoryName_bn: string;
  vendorId: string;
  vendorName: string;
  storeId: string;
  storeName: string;
  zoneIds: string[];
  price: number;
  discountPrice?: number;
  rating: number;
  stockStatus: 'in_stock' | 'out_of_stock';
  imageUrl: string;
  slug: string;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeilisearchStoreDoc {
  id: string;
  type: 'store';
  module: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  imageUrl: string;
  coverUrl: string;
  rating: number;
  zoneIds: string[];
  status: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

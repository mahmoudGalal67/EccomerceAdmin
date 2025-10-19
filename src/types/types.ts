export type ProductType = {
  id: number;
  seller_id: number;
  name: string;
  slug: string;
  description?: string | null;
  base_price?: string | null; // optional if variants exist
  is_active: boolean | number;
  is_featured: boolean | number;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  categories: Category[];
  variants?: Variant[]; // optional
};

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  slug: string;
  parent_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  pivot: Pivot;
}

export interface Pivot {
  product_id: number;
  category_id: number;
}

export interface Variant {
  id: number;
  product_id: number;
  color_id: number;
  size_id: number;
  sku?: string | null;
  stock: number;
  price: string;
  is_active: boolean | number;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  images: VariantImage[];
}

export interface VariantImage {
  id: number;
  variant_id: number;
  file_path: string;
  is_main: boolean | number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type categoryType = {
  id?: number;
  name: string;
  parent_id?: string;
  description?: string;
  slug?: string;
  icon?: File | string | null;
};
export type colorType = {
  id: number;
  name: string;
  hex: string;
};
export type sizeType = {
  id: number;
  name: string;
  code: string;
};

export type Language = 'sv' | 'en';

export type Unit = 'kg' | 'g' | 'liter' | 'ml' | 'pcs' | 'box' | 'bag';

export type BatchStatus = 'active' | 'completed' | 'recalled' | 'expired';

export interface Item {
  id: string;
  name_sv: string;
  name_en: string;
  sku: string;
  current_stock: number;
  unit: Unit;
  low_stock_threshold?: number;
}

export interface Batch {
  id: string;
  item_id: string;
  batch_id: string;
  prod_date: string;
  exp_date: string;
  status: BatchStatus;
  quantity?: number;
  notes?: string;
}

export type Screen = 'dashboard' | 'inventory' | 'batches';

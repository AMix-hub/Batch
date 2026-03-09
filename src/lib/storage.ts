import { Item, Batch } from '../types';

const ITEMS_KEY = 'batch_tracker_items';
const BATCHES_KEY = 'batch_tracker_batches';

// ─── Seed data ───────────────────────────────────────────────────────────────

const SEED_ITEMS: Item[] = [
  {
    id: '1',
    name_sv: 'Vetemjöl',
    name_en: 'Wheat Flour',
    sku: 'WF-001',
    current_stock: 50,
    unit: 'kg',
    low_stock_threshold: 10,
  },
  {
    id: '2',
    name_sv: 'Humle (Cascade)',
    name_en: 'Hops (Cascade)',
    sku: 'HC-002',
    current_stock: 3,
    unit: 'kg',
    low_stock_threshold: 5,
  },
  {
    id: '3',
    name_sv: 'Maltextrakt',
    name_en: 'Malt Extract',
    sku: 'ME-003',
    current_stock: 25,
    unit: 'kg',
    low_stock_threshold: 8,
  },
  {
    id: '4',
    name_sv: 'Jäst (Ale)',
    name_en: 'Yeast (Ale)',
    sku: 'YA-004',
    current_stock: 12,
    unit: 'pcs',
    low_stock_threshold: 4,
  },
];

const SEED_BATCHES: Batch[] = [
  {
    id: '1',
    item_id: '3',
    batch_id: 'BATCH-2024-001',
    prod_date: '2024-01-15',
    exp_date: '2025-01-15',
    status: 'active',
    quantity: 100,
    notes: 'First batch of the year',
  },
  {
    id: '2',
    item_id: '1',
    batch_id: 'BATCH-2024-002',
    prod_date: '2024-02-01',
    exp_date: '2025-02-01',
    status: 'active',
    quantity: 200,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__ls_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// ─── Items ───────────────────────────────────────────────────────────────────

export function getItems(): Item[] {
  if (!isLocalStorageAvailable()) return SEED_ITEMS;
  const raw = window.localStorage.getItem(ITEMS_KEY);
  if (!raw) {
    window.localStorage.setItem(ITEMS_KEY, JSON.stringify(SEED_ITEMS));
    return SEED_ITEMS;
  }
  return JSON.parse(raw) as Item[];
}

export function saveItems(items: Item[]): void {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function addItem(item: Omit<Item, 'id'>): Item {
  const items = getItems();
  const newItem: Item = { ...item, id: crypto.randomUUID() };
  saveItems([...items, newItem]);
  return newItem;
}

export function updateItem(updated: Item): void {
  const items = getItems().map((i) => (i.id === updated.id ? updated : i));
  saveItems(items);
}

export function deleteItem(id: string): void {
  saveItems(getItems().filter((i) => i.id !== id));
}

export function findItemBySku(sku: string): Item | undefined {
  return getItems().find((i) => i.sku === sku);
}

// ─── Batches ─────────────────────────────────────────────────────────────────

export function getBatches(): Batch[] {
  if (!isLocalStorageAvailable()) return SEED_BATCHES;
  const raw = window.localStorage.getItem(BATCHES_KEY);
  if (!raw) {
    window.localStorage.setItem(BATCHES_KEY, JSON.stringify(SEED_BATCHES));
    return SEED_BATCHES;
  }
  return JSON.parse(raw) as Batch[];
}

export function saveBatches(batches: Batch[]): void {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
}

export function addBatch(batch: Omit<Batch, 'id'>): Batch {
  const batches = getBatches();
  const newBatch: Batch = { ...batch, id: crypto.randomUUID() };
  saveBatches([...batches, newBatch]);
  return newBatch;
}

export function updateBatch(updated: Batch): void {
  const batches = getBatches().map((b) => (b.id === updated.id ? updated : b));
  saveBatches(batches);
}

export function deleteBatch(id: string): void {
  saveBatches(getBatches().filter((b) => b.id !== id));
}

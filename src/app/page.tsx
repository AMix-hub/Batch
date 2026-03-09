'use client';

import { useState, useCallback } from 'react';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Boxes,
  Search,
  Plus,
  Scan,
  Pencil,
  Trash2,
  X,
  Globe,
  CalendarDays,
  Hash,
  QrCode,
} from 'lucide-react';

import { Item, Batch, Screen, Language, BatchStatus, Unit } from '../types';
import translations from '../translations';
import {
  getItems,
  getBatches,
  addItem,
  updateItem,
  deleteItem,
  addBatch,
  updateBatch,
  deleteBatch,
} from '../lib/storage';
import ScannerComponent from '../components/ScannerComponent';
import QRCodeModal from '../components/QRCodeModal';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('sv-SE');
}

function isExpiringSoon(expDate: string, days = 30): boolean {
  const exp = new Date(expDate);
  const now = new Date();
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= days;
}

function isLowStock(item: Item): boolean {
  return item.current_stock <= (item.low_stock_threshold ?? 5);
}

const UNITS: Unit[] = ['kg', 'g', 'liter', 'ml', 'pcs', 'box', 'bag'];
const STATUSES: BatchStatus[] = ['active', 'completed', 'recalled', 'expired'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div className={`bg-gray-800 rounded-2xl p-4 flex items-center gap-4 border ${accent}`}>
      <div className="p-3 rounded-xl bg-gray-700">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────

function DashboardScreen({
  language,
  items,
  batches,
}: {
  language: Language;
  items: Item[];
  batches: Batch[];
}) {
  const t = translations[language];
  const activeBatches = batches.filter((b) => b.status === 'active');
  const lowStockItems = items.filter(isLowStock);
  const recentBatches = [...batches]
    .sort((a, b) => b.prod_date.localeCompare(a.prod_date))
    .slice(0, 5);

  const getItemName = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return '—';
    return language === 'sv' ? item.name_sv : item.name_en;
  };

  const getBatchStatusColor = (status: BatchStatus) => {
    switch (status) {
      case 'active': return 'bg-green-900/50 text-green-400 border-green-700';
      case 'completed': return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'recalled': return 'bg-red-900/50 text-red-400 border-red-700';
      case 'expired': return 'bg-gray-700/50 text-gray-400 border-gray-600';
    }
  };

  const getBatchStatusLabel = (status: BatchStatus) => {
    const map: Record<BatchStatus, string> = {
      active: t.batches_active,
      completed: t.batches_completed,
      recalled: t.batches_recalled,
      expired: t.batches_expired,
    };
    return map[status];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t.dashboard_title}</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Boxes className="text-indigo-400" size={24} />}
          label={t.dashboard_total_items}
          value={items.length}
          accent="border-indigo-800"
        />
        <StatCard
          icon={<TrendingUp className="text-emerald-400" size={24} />}
          label={t.dashboard_active_batches}
          value={activeBatches.length}
          accent="border-emerald-800"
        />
        <StatCard
          icon={<AlertTriangle className="text-amber-400" size={24} />}
          label={t.dashboard_low_stock_alerts}
          value={lowStockItems.length}
          accent="border-amber-800"
        />
      </div>

      {/* Low stock warnings */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-900/20 border border-amber-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-amber-400" size={18} />
            <h2 className="text-amber-300 font-semibold">{t.dashboard_low_stock_alerts}</h2>
          </div>
          <ul className="space-y-2">
            {lowStockItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span className="text-white text-sm">
                  {language === 'sv' ? item.name_sv : item.name_en}
                </span>
                <span className="text-amber-300 text-sm font-mono">
                  {item.current_stock} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent batches */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">{t.dashboard_recent_batches}</h2>
        {recentBatches.length === 0 ? (
          <p className="text-gray-500 text-sm">{t.dashboard_no_batches}</p>
        ) : (
          <div className="space-y-2">
            {recentBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-gray-800 rounded-xl p-3 flex items-center justify-between border border-gray-700"
              >
                <div>
                  <p className="text-white font-medium text-sm">{batch.batch_id}</p>
                  <p className="text-gray-400 text-xs">{getItemName(batch.item_id)}</p>
                  {isExpiringSoon(batch.exp_date) && (
                    <p className="text-amber-400 text-xs mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {t.dashboard_expiring_soon}: {formatDate(batch.exp_date)}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${getBatchStatusColor(
                    batch.status
                  )}`}
                >
                  {getBatchStatusLabel(batch.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Item Form Modal ──────────────────────────────────────────────────────────

interface ItemFormProps {
  language: Language;
  existing?: Item | null;
  onSave: (item: Item | Omit<Item, 'id'>) => void;
  onCancel: () => void;
}

function ItemFormModal({ language, existing, onSave, onCancel }: ItemFormProps) {
  const t = translations[language];
  const [nameSv, setNameSv] = useState(existing?.name_sv ?? '');
  const [nameEn, setNameEn] = useState(existing?.name_en ?? '');
  const [sku, setSku] = useState(existing?.sku ?? '');
  const [stock, setStock] = useState(existing?.current_stock?.toString() ?? '0');
  const [unit, setUnit] = useState<Unit>(existing?.unit ?? 'kg');
  const [threshold, setThreshold] = useState(existing?.low_stock_threshold?.toString() ?? '5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name_sv: nameSv,
      name_en: nameEn,
      sku,
      current_stock: parseFloat(stock) || 0,
      unit,
      low_stock_threshold: parseFloat(threshold) || 5,
    };
    if (existing) {
      onSave({ ...data, id: existing.id });
    } else {
      onSave(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg">
            {existing ? t.inventory_edit_item : t.inventory_add_new_item}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">{t.inventory_name_sv}</label>
              <input
                required
                value={nameSv}
                onChange={(e) => setNameSv(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">{t.inventory_name_en}</label>
              <input
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">{t.inventory_sku}</label>
            <input
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">{t.inventory_stock_level}</label>
              <input
                type="number"
                min={0}
                step="any"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">{t.inventory_unit}</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">{t.inventory_threshold}</label>
            <input
              type="number"
              min={0}
              step="any"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              {t.inventory_cancel}
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              {t.inventory_save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Inventory Screen ─────────────────────────────────────────────────────────

function InventoryScreen({
  language,
  items,
  onItemsChange,
}: {
  language: Language;
  items: Item[];
  onItemsChange: () => void;
}) {
  const t = translations[language];
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [qrItem, setQrItem] = useState<Item | null>(null);

  const filtered = items.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.name_sv.toLowerCase().includes(q) ||
      item.name_en.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q)
    );
  });

  const handleSave = (data: Item | Omit<Item, 'id'>) => {
    if ('id' in data) {
      updateItem(data as Item);
    } else {
      addItem(data);
    }
    setShowForm(false);
    setEditingItem(null);
    onItemsChange();
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    setConfirmDeleteId(null);
    onItemsChange();
  };

  const handleItemFound = (item: Item) => {
    setShowScanner(false);
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t.inventory_title}</h1>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          {t.inventory_add_item}
        </button>
      </div>

      {/* Search + Scan */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.inventory_search_placeholder}
            className="w-full bg-gray-800 text-white rounded-xl pl-9 pr-3 py-2.5 text-sm border border-gray-700 focus:border-indigo-500 focus:outline-none placeholder-gray-500"
          />
        </div>
        <button
          onClick={() => setShowScanner(true)}
          className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Scan size={16} />
          {t.inventory_scan_button}
        </button>
      </div>

      {/* Item list */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">{t.inventory_no_items}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const low = isLowStock(item);
            return (
              <div
                key={item.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm truncate">
                      {language === 'sv' ? item.name_sv : item.name_en}
                    </p>
                    {low && (
                      <span className="shrink-0 text-xs bg-amber-900/50 text-amber-400 border border-amber-700 px-1.5 py-0.5 rounded-full">
                        {t.inventory_low_stock}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {t.inventory_sku}: {item.sku}
                  </p>
                  <p className={`text-sm mt-1 font-mono ${low ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {item.current_stock} {item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setQrItem(item)}
                    className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={t.qr_button}
                  >
                    <QrCode size={15} />
                  </button>
                  <button
                    onClick={() => { setEditingItem(item); setShowForm(true); }}
                    className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={t.common_edit}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={t.common_delete}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl">
            <p className="text-white text-center mb-4">{t.common_confirm_delete}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {t.common_no}
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {t.common_yes}
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <ItemFormModal
          language={language}
          existing={editingItem}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}

      {showScanner && (
        <ScannerComponent
          language={language}
          items={items}
          onItemFound={handleItemFound}
          onClose={() => setShowScanner(false)}
        />
      )}

      {qrItem && (
        <QRCodeModal
          language={language}
          item={qrItem}
          onClose={() => setQrItem(null)}
        />
      )}
    </div>
  );
}

// ─── Batch Form Modal ─────────────────────────────────────────────────────────

interface BatchFormProps {
  language: Language;
  items: Item[];
  existing?: Batch | null;
  onSave: (batch: Batch | Omit<Batch, 'id'>) => void;
  onCancel: () => void;
}

function BatchFormModal({ language, items, existing, onSave, onCancel }: BatchFormProps) {
  const t = translations[language];
  const [itemId, setItemId] = useState(existing?.item_id ?? '');
  const [batchId, setBatchId] = useState(existing?.batch_id ?? '');
  const [prodDate, setProdDate] = useState(existing?.prod_date ?? '');
  const [expDate, setExpDate] = useState(existing?.exp_date ?? '');
  const [status, setStatus] = useState<BatchStatus>(existing?.status ?? 'active');
  const [quantity, setQuantity] = useState(existing?.quantity?.toString() ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const getStatusLabel = (s: BatchStatus) => {
    const map: Record<BatchStatus, string> = {
      active: t.batches_active,
      completed: t.batches_completed,
      recalled: t.batches_recalled,
      expired: t.batches_expired,
    };
    return map[s];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Omit<Batch, 'id'> = {
      item_id: itemId,
      batch_id: batchId,
      prod_date: prodDate,
      exp_date: expDate,
      status,
      quantity: quantity ? parseFloat(quantity) : undefined,
      notes: notes || undefined,
    };
    if (existing) {
      onSave({ ...data, id: existing.id });
    } else {
      onSave(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-900">
          <h2 className="text-white font-semibold text-lg">
            {existing ? t.batches_edit_batch : t.batches_new_batch}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-gray-400 text-xs mb-1">{t.batches_item_label}</label>
            <select
              required
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">{t.batches_select_item}</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {language === 'sv' ? i.name_sv : i.name_en} ({i.sku})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">{t.batches_batch_id_label}</label>
            <input
              required
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="BATCH-2024-001"
              className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">{t.batches_prod_date_label}</label>
              <input
                required
                type="date"
                value={prodDate}
                onChange={(e) => setProdDate(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">{t.batches_exp_date_label}</label>
              <input
                required
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">{t.batches_status_label}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BatchStatus)}
                className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {getStatusLabel(s)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">{t.batches_quantity_label}</label>
              <input
                type="number"
                min={0}
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">{t.batches_notes_label}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 text-sm border border-gray-600 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              {t.batches_cancel}
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              {t.batches_save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Batch Manager Screen ─────────────────────────────────────────────────────

function BatchManagerScreen({
  language,
  items,
  batches,
  onBatchesChange,
}: {
  language: Language;
  items: Item[];
  batches: Batch[];
  onBatchesChange: () => void;
}) {
  const t = translations[language];
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const getItemName = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return '—';
    return language === 'sv' ? item.name_sv : item.name_en;
  };

  const getBatchStatusColor = (status: BatchStatus) => {
    switch (status) {
      case 'active': return 'bg-green-900/50 text-green-400 border-green-700';
      case 'completed': return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'recalled': return 'bg-red-900/50 text-red-400 border-red-700';
      case 'expired': return 'bg-gray-700/50 text-gray-400 border-gray-600';
    }
  };

  const getBatchStatusLabel = (status: BatchStatus) => {
    const map: Record<BatchStatus, string> = {
      active: t.batches_active,
      completed: t.batches_completed,
      recalled: t.batches_recalled,
      expired: t.batches_expired,
    };
    return map[status];
  };

  const handleSave = (data: Batch | Omit<Batch, 'id'>) => {
    if ('id' in data) {
      updateBatch(data as Batch);
    } else {
      addBatch(data);
    }
    setShowForm(false);
    setEditingBatch(null);
    onBatchesChange();
  };

  const handleDelete = (id: string) => {
    deleteBatch(id);
    setConfirmDeleteId(null);
    onBatchesChange();
  };

  const sorted = [...batches].sort((a, b) => b.prod_date.localeCompare(a.prod_date));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t.batches_title}</h1>
        <button
          onClick={() => { setEditingBatch(null); setShowForm(true); }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          {t.batches_new_batch}
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">{t.batches_no_batches}</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((batch) => (
            <div
              key={batch.id}
              className="bg-gray-800 rounded-xl border border-gray-700 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{batch.batch_id}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getBatchStatusColor(
                        batch.status
                      )}`}
                    >
                      {getBatchStatusLabel(batch.status)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {getItemName(batch.item_id)}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <CalendarDays size={11} />
                      {formatDate(batch.prod_date)}
                    </span>
                    <span
                      className={`text-xs flex items-center gap-1 ${
                        isExpiringSoon(batch.exp_date)
                          ? 'text-amber-400'
                          : 'text-gray-500'
                      }`}
                    >
                      <CalendarDays size={11} />
                      {formatDate(batch.exp_date)}
                      {isExpiringSoon(batch.exp_date) && (
                        <AlertTriangle size={11} />
                      )}
                    </span>
                    {batch.quantity !== undefined && (
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Hash size={11} />
                        {batch.quantity}
                      </span>
                    )}
                  </div>
                  {batch.notes && (
                    <p className="text-gray-500 text-xs mt-1 italic">{batch.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setEditingBatch(batch); setShowForm(true); }}
                    className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={t.common_edit}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(batch.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={t.common_delete}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl">
            <p className="text-white text-center mb-4">{t.common_confirm_delete}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {t.common_no}
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {t.common_yes}
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <BatchFormModal
          language={language}
          items={items}
          existing={editingBatch}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingBatch(null); }}
        />
      )}
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({
  active,
  language,
  onChange,
}: {
  active: Screen;
  language: Language;
  onChange: (s: Screen) => void;
}) {
  const t = translations[language];

  const tabs: { id: Screen; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: t.nav_dashboard,
      icon: <LayoutDashboard size={22} />,
    },
    {
      id: 'inventory',
      label: t.nav_inventory,
      icon: <Package size={22} />,
    },
    {
      id: 'batches',
      label: t.nav_batches,
      icon: <ClipboardList size={22} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-700 z-40">
      <div className="flex max-w-xl mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                isActive
                  ? 'text-indigo-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.icon}
              <span className="text-xs font-medium leading-none">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-10 bg-indigo-500 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [language, setLanguage] = useState<Language>('sv');
  // Lazy initializers load from localStorage on first client render;
  // storage.ts gracefully returns seed data when localStorage is unavailable (SSR).
  const [items, setItems] = useState<Item[]>(getItems);
  const [batches, setBatches] = useState<Batch[]>(getBatches);

  const reloadItems = useCallback(() => setItems(getItems()), []);
  const reloadBatches = useCallback(() => setBatches(getBatches()), []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center justify-between max-w-xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Boxes size={15} className="text-white" />
          </div>
          <span className="font-bold text-white text-base">BatchTrack</span>
        </div>
        <button
          onClick={() => setLanguage((l) => (l === 'sv' ? 'en' : 'sv'))}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-xl"
        >
          <Globe size={14} />
          {language === 'sv' ? 'EN' : 'SV'}
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-xl mx-auto px-4 pt-6 pb-28">
        {screen === 'dashboard' && (
          <DashboardScreen language={language} items={items} batches={batches} />
        )}
        {screen === 'inventory' && (
          <InventoryScreen
            language={language}
            items={items}
            onItemsChange={reloadItems}
          />
        )}
        {screen === 'batches' && (
          <BatchManagerScreen
            language={language}
            items={items}
            batches={batches}
            onBatchesChange={reloadBatches}
          />
        )}
      </main>

      {/* Bottom navigation */}
      <BottomNav active={screen} language={language} onChange={setScreen} />
    </div>
  );
}

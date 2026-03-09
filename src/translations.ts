import { Language } from './types';

export interface TranslationDictionary {
  // Navigation
  nav_dashboard: string;
  nav_inventory: string;
  nav_batches: string;

  // Dashboard
  dashboard_title: string;
  dashboard_total_items: string;
  dashboard_active_batches: string;
  dashboard_low_stock_alerts: string;
  dashboard_recent_batches: string;
  dashboard_no_batches: string;
  dashboard_expiring_soon: string;
  dashboard_items: string;

  // Inventory
  inventory_title: string;
  inventory_search_placeholder: string;
  inventory_scan_button: string;
  inventory_add_item: string;
  inventory_no_items: string;
  inventory_low_stock: string;
  inventory_in_stock: string;
  inventory_sku: string;
  inventory_stock_level: string;
  inventory_name: string;
  inventory_unit: string;
  inventory_save: string;
  inventory_cancel: string;
  inventory_add_new_item: string;
  inventory_edit_item: string;
  inventory_delete_item: string;
  inventory_name_sv: string;
  inventory_name_en: string;
  inventory_threshold: string;

  // Batch Manager
  batches_title: string;
  batches_create_new: string;
  batches_item_label: string;
  batches_batch_id_label: string;
  batches_prod_date_label: string;
  batches_exp_date_label: string;
  batches_status_label: string;
  batches_quantity_label: string;
  batches_notes_label: string;
  batches_save: string;
  batches_cancel: string;
  batches_no_batches: string;
  batches_select_item: string;
  batches_active: string;
  batches_completed: string;
  batches_recalled: string;
  batches_expired: string;
  batches_delete: string;
  batches_new_batch: string;
  batches_edit_batch: string;

  // QR Code
  qr_title: string;
  qr_description: string;
  qr_download: string;
  qr_close: string;
  qr_button: string;

  // Scanner
  scanner_title: string;
  scanner_start: string;
  scanner_stop: string;
  scanner_result: string;
  scanner_item_found: string;
  scanner_item_not_found: string;
  scanner_instructions: string;
  scanner_permission_denied: string;
  scanner_error: string;
  scanner_close: string;

  // Common
  common_loading: string;
  common_error: string;
  common_save: string;
  common_cancel: string;
  common_delete: string;
  common_edit: string;
  common_add: string;
  common_close: string;
  common_search: string;
  common_language: string;
  common_confirm_delete: string;
  common_yes: string;
  common_no: string;
}

const translations: Record<Language, TranslationDictionary> = {
  sv: {
    // Navigation
    nav_dashboard: 'Översikt',
    nav_inventory: 'Lager',
    nav_batches: 'Satser',

    // Dashboard
    dashboard_title: 'Översikt',
    dashboard_total_items: 'Totalt antal artiklar',
    dashboard_active_batches: 'Aktiva satser',
    dashboard_low_stock_alerts: 'Lågt lager-varningar',
    dashboard_recent_batches: 'Senaste satser',
    dashboard_no_batches: 'Inga satser skapade ännu.',
    dashboard_expiring_soon: 'Går ut snart',
    dashboard_items: 'artiklar',

    // Inventory
    inventory_title: 'Lager',
    inventory_search_placeholder: 'Sök artikel...',
    inventory_scan_button: 'Skanna',
    inventory_add_item: 'Lägg till artikel',
    inventory_no_items: 'Inga artiklar hittades.',
    inventory_low_stock: 'Lågt lager',
    inventory_in_stock: 'I lager',
    inventory_sku: 'SKU',
    inventory_stock_level: 'Lagernivå',
    inventory_name: 'Namn',
    inventory_unit: 'Enhet',
    inventory_save: 'Spara',
    inventory_cancel: 'Avbryt',
    inventory_add_new_item: 'Lägg till ny artikel',
    inventory_edit_item: 'Redigera artikel',
    inventory_delete_item: 'Ta bort artikel',
    inventory_name_sv: 'Namn (Svenska)',
    inventory_name_en: 'Namn (Engelska)',
    inventory_threshold: 'Larm för lågt lager',

    // Batch Manager
    batches_title: 'Satshanteraren',
    batches_create_new: 'Skapa ny sats',
    batches_item_label: 'Artikel',
    batches_batch_id_label: 'Sats-ID',
    batches_prod_date_label: 'Produktionsdatum',
    batches_exp_date_label: 'Utgångsdatum',
    batches_status_label: 'Status',
    batches_quantity_label: 'Kvantitet',
    batches_notes_label: 'Anteckningar',
    batches_save: 'Spara sats',
    batches_cancel: 'Avbryt',
    batches_no_batches: 'Inga satser skapade ännu.',
    batches_select_item: 'Välj artikel...',
    batches_active: 'Aktiv',
    batches_completed: 'Slutförd',
    batches_recalled: 'Återkallad',
    batches_expired: 'Utgången',
    batches_delete: 'Ta bort sats',
    batches_new_batch: 'Ny sats',
    batches_edit_batch: 'Redigera sats',

    // QR Code
    qr_title: 'QR-kod',
    qr_description: 'Skanna med appen för att hitta denna artikel.',
    qr_download: 'Ladda ner',
    qr_close: 'Stäng',
    qr_button: 'Visa QR',

    // Scanner
    scanner_title: 'Skanna streckkod',
    scanner_start: 'Starta kamera',
    scanner_stop: 'Stoppa kamera',
    scanner_result: 'Skannat värde',
    scanner_item_found: 'Artikel hittad',
    scanner_item_not_found: 'Ingen artikel hittades för den skannade koden.',
    scanner_instructions: 'Rikta kameran mot streckkoden för att skanna.',
    scanner_permission_denied: 'Kamerabehörighet nekad. Kontrollera dina webbläsarinställningar.',
    scanner_error: 'Det gick inte att starta kameran. Försök igen.',
    scanner_close: 'Stäng',

    // Common
    common_loading: 'Laddar...',
    common_error: 'Fel',
    common_save: 'Spara',
    common_cancel: 'Avbryt',
    common_delete: 'Ta bort',
    common_edit: 'Redigera',
    common_add: 'Lägg till',
    common_close: 'Stäng',
    common_search: 'Sök',
    common_language: 'Språk',
    common_confirm_delete: 'Är du säker på att du vill ta bort detta?',
    common_yes: 'Ja',
    common_no: 'Nej',
  },

  en: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_inventory: 'Inventory',
    nav_batches: 'Batches',

    // Dashboard
    dashboard_title: 'Dashboard',
    dashboard_total_items: 'Total Items',
    dashboard_active_batches: 'Active Batches',
    dashboard_low_stock_alerts: 'Low Stock Alerts',
    dashboard_recent_batches: 'Recent Batches',
    dashboard_no_batches: 'No batches created yet.',
    dashboard_expiring_soon: 'Expiring soon',
    dashboard_items: 'items',

    // Inventory
    inventory_title: 'Inventory',
    inventory_search_placeholder: 'Search item...',
    inventory_scan_button: 'Scan',
    inventory_add_item: 'Add Item',
    inventory_no_items: 'No items found.',
    inventory_low_stock: 'Low Stock',
    inventory_in_stock: 'In Stock',
    inventory_sku: 'SKU',
    inventory_stock_level: 'Stock Level',
    inventory_name: 'Name',
    inventory_unit: 'Unit',
    inventory_save: 'Save',
    inventory_cancel: 'Cancel',
    inventory_add_new_item: 'Add New Item',
    inventory_edit_item: 'Edit Item',
    inventory_delete_item: 'Delete Item',
    inventory_name_sv: 'Name (Swedish)',
    inventory_name_en: 'Name (English)',
    inventory_threshold: 'Low Stock Threshold',

    // Batch Manager
    batches_title: 'Batch Manager',
    batches_create_new: 'Create New Batch',
    batches_item_label: 'Item',
    batches_batch_id_label: 'Batch ID',
    batches_prod_date_label: 'Production Date',
    batches_exp_date_label: 'Expiry Date',
    batches_status_label: 'Status',
    batches_quantity_label: 'Quantity',
    batches_notes_label: 'Notes',
    batches_save: 'Save Batch',
    batches_cancel: 'Cancel',
    batches_no_batches: 'No batches created yet.',
    batches_select_item: 'Select item...',
    batches_active: 'Active',
    batches_completed: 'Completed',
    batches_recalled: 'Recalled',
    batches_expired: 'Expired',
    batches_delete: 'Delete Batch',
    batches_new_batch: 'New Batch',
    batches_edit_batch: 'Edit Batch',

    // QR Code
    qr_title: 'QR Code',
    qr_description: 'Scan with the app to find this item.',
    qr_download: 'Download',
    qr_close: 'Close',
    qr_button: 'Show QR',

    // Scanner
    scanner_title: 'Scan Barcode',
    scanner_start: 'Start Camera',
    scanner_stop: 'Stop Camera',
    scanner_result: 'Scanned Value',
    scanner_item_found: 'Item Found',
    scanner_item_not_found: 'No item found for the scanned code.',
    scanner_instructions: 'Point the camera at the barcode to scan.',
    scanner_permission_denied: 'Camera permission denied. Check your browser settings.',
    scanner_error: 'Could not start the camera. Please try again.',
    scanner_close: 'Close',

    // Common
    common_loading: 'Loading...',
    common_error: 'Error',
    common_save: 'Save',
    common_cancel: 'Cancel',
    common_delete: 'Delete',
    common_edit: 'Edit',
    common_add: 'Add',
    common_close: 'Close',
    common_search: 'Search',
    common_language: 'Language',
    common_confirm_delete: 'Are you sure you want to delete this?',
    common_yes: 'Yes',
    common_no: 'No',
  },
};

export default translations;

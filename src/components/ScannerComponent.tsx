'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Camera, CameraOff } from 'lucide-react';
import { Item, Language } from '../types';
import translations from '../translations';

interface ScannerComponentProps {
  language: Language;
  items: Item[];
  onItemFound: (item: Item) => void;
  onClose: () => void;
}

export default function ScannerComponent({
  language,
  items,
  onItemFound,
  onClose,
}: ScannerComponentProps) {
  const t = translations[language];
  const scannerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrRef = useRef<any>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [foundItem, setFoundItem] = useState<Item | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const SCANNER_ID = 'html5qr-scanner-region';

  const handleScan = (decodedText: string) => {
    setScannedValue(decodedText);
    const match = items.find(
      (item) =>
        item.sku === decodedText ||
        item.id === decodedText
    );
    if (match) {
      setFoundItem(match);
      onItemFound(match);
    } else {
      setFoundItem(null);
    }
    stopScanner();
  };

  const startScanner = async () => {
    setErrorMsg(null);
    setScannedValue(null);
    setFoundItem(null);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode(SCANNER_ID);
      html5QrRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        handleScan,
        () => {}
      );
      setIsRunning(true);
    } catch (err) {
      const msg = String(err);
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('denied')) {
        setErrorMsg(t.scanner_permission_denied);
      } else {
        setErrorMsg(t.scanner_error);
      }
      setIsRunning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch {
        // ignore errors when stopping
      }
      html5QrRef.current = null;
    }
    setIsRunning(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  const itemName = foundItem
    ? language === 'sv'
      ? foundItem.name_sv
      : foundItem.name_en
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Camera className="text-indigo-400" size={20} />
            <h2 className="text-white font-semibold text-lg">{t.scanner_title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            aria-label={t.scanner_close}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner viewport */}
        <div className="p-4">
          <div
            id={SCANNER_ID}
            ref={scannerRef}
            className="w-full rounded-xl overflow-hidden bg-gray-800 min-h-[200px] flex items-center justify-center"
          >
            {!isRunning && !scannedValue && (
              <div className="text-gray-500 text-sm text-center px-4">
                <CameraOff size={40} className="mx-auto mb-2 opacity-50" />
                <p>{t.scanner_instructions}</p>
              </div>
            )}
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mt-3 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Scanned result */}
          {scannedValue && (
            <div className="mt-3 space-y-2">
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                  {t.scanner_result}
                </p>
                <p className="text-white font-mono text-sm break-all">{scannedValue}</p>
              </div>

              {foundItem ? (
                <div className="p-3 bg-green-900/40 border border-green-700 rounded-lg">
                  <p className="text-green-400 text-xs uppercase tracking-wide mb-1">
                    {t.scanner_item_found}
                  </p>
                  <p className="text-white font-semibold">{itemName}</p>
                  <p className="text-gray-400 text-sm">
                    {t.inventory_sku}: {foundItem.sku}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t.inventory_stock_level}: {foundItem.current_stock} {foundItem.unit}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-yellow-900/40 border border-yellow-700 rounded-lg">
                  <p className="text-yellow-300 text-sm">{t.scanner_item_not_found}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex gap-3">
          {!isRunning ? (
            <button
              onClick={startScanner}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
            >
              <Camera size={18} />
              {t.scanner_start}
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="flex-1 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
            >
              <CameraOff size={18} />
              {t.scanner_stop}
            </button>
          )}
          <button
            onClick={handleClose}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
          >
            {t.scanner_close}
          </button>
        </div>
      </div>
    </div>
  );
}

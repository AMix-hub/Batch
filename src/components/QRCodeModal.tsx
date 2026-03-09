'use client';

import { useRef } from 'react';
import { X, Download, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Item, Language } from '../types';
import translations from '../translations';

interface QRCodeModalProps {
  language: Language;
  item: Item;
  onClose: () => void;
}

export default function QRCodeModal({ language, item, onClose }: QRCodeModalProps) {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const itemName = language === 'sv' ? item.name_sv : item.name_en;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-${item.sku}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <QrCode className="text-indigo-400" size={20} />
            <h2 className="text-white font-semibold text-lg">{t.qr_title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            aria-label={t.qr_close}
          >
            <X size={20} />
          </button>
        </div>

        {/* QR Code */}
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-xl">
            <QRCodeCanvas
              ref={canvasRef}
              value={item.sku}
              size={200}
              marginSize={1}
            />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-base">{itemName}</p>
            <p className="text-gray-400 text-sm mt-0.5">{item.sku}</p>
            <p className="text-gray-500 text-xs mt-2">{t.qr_description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
          >
            <Download size={18} />
            {t.qr_download}
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
          >
            {t.qr_close}
          </button>
        </div>
      </div>
    </div>
  );
}

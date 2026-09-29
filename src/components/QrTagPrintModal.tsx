import React, { useRef } from 'react';
import { Asset } from '../types/asset';
import { X, Printer, QrCode } from 'lucide-react';

interface QrTagPrintModalProps {
  assets: Asset[];
  onClose: () => void;
}

export const QrTagPrintModal: React.FC<QrTagPrintModalProps> = ({ assets, onClose }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 print:hidden">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">
              Etiquetas Patrimoniais de Tombamento (QR Code / RFID)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Etiquetas padronizadas para fixação em bens móveis, veículos, equipamentos e activos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              Imprimir Etiquetas
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tags Container */}
        <div ref={printAreaRef} className="p-6 overflow-y-auto print:p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="border-2 border-neutral-900 rounded-lg p-3 bg-white flex flex-col justify-between relative print:break-inside-avoid shadow-xs"
              >
                {/* Header Tag */}
                <div className="border-b border-neutral-300 pb-2 mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 block">
                      República de Angola · Património
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-900">
                      {asset.localizacao}
                    </span>
                  </div>
                  <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs"></div>
                </div>

                {/* Tag Body */}
                <div className="flex items-start gap-3 my-1">
                  {/* QR Simulation Box */}
                  <div className="w-18 h-18 bg-neutral-100 border border-neutral-400 p-1 flex flex-col items-center justify-center shrink-0">
                    <QrCode className="w-14 h-14 text-neutral-900" />
                    <span className="text-[8px] font-mono text-neutral-600 mt-0.5">SCAN QR</span>
                  </div>

                  {/* Information */}
                  <div className="flex-1 min-w-0">
                    <div className="font-mono font-bold text-sm text-neutral-950 tracking-tight">
                      {asset.patrimonioId}
                    </div>
                    <div className="text-[11px] font-semibold text-neutral-900 line-clamp-2 mt-0.5">
                      {asset.descricao}
                    </div>
                    <div className="text-[10px] text-neutral-600 mt-1 truncate">
                      <strong>Marca:</strong> {asset.marca}
                    </div>
                    <div className="text-[10px] text-neutral-600 truncate">
                      <strong>Sector:</strong> {asset.sala} ({asset.piso})
                    </div>
                  </div>
                </div>

                {/* Barcode & Warning footer */}
                <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                  <span>SÉRIE: {asset.numeroSerieOuChassi || asset.id.slice(0, 8)}</span>
                  <span className="text-neutral-900 font-bold uppercase">Uso Oficial</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs print:hidden">
          <span className="text-neutral-500">
            Total de etiquetas a imprimir: <strong className="text-neutral-900">{assets.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-medium rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

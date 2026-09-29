import React from 'react';
import { Plus, Download, Upload, QrCode } from 'lucide-react';

interface HeaderProps {
  currentTab: 'inventory' | 'cards' | 'audit' | 'depreciation';
  onTabChange: (tab: 'inventory' | 'cards' | 'audit' | 'depreciation') => void;
  onNewAsset: () => void;
  onExportCSV: () => void;
  onImportClick: () => void;
  onBatchTags: () => void;
  assetCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onNewAsset,
  onExportCSV,
  onImportClick,
  onBatchTags,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('inventory');
              }}
              className="text-lg font-bold tracking-tight text-neutral-900 flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 bg-neutral-900 rounded-sm"></span>
              PatrimônioPro
            </a>
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              v2.6 · Gestão Integrada
            </span>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => onTabChange('inventory')}
              className={`pb-1 text-sm font-medium transition-colors border-b-2 ${
                currentTab === 'inventory'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Planilha Inventário
            </button>
            <button
              onClick={() => onTabChange('cards')}
              className={`pb-1 text-sm font-medium transition-colors border-b-2 ${
                currentTab === 'cards'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Galeria de Bens
            </button>
            <button
              onClick={() => onTabChange('audit')}
              className={`pb-1 text-sm font-medium transition-colors border-b-2 ${
                currentTab === 'audit'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Conferência & Auditoria
            </button>
            <button
              onClick={() => onTabChange('depreciation')}
              className={`pb-1 text-sm font-medium transition-colors border-b-2 ${
                currentTab === 'depreciation'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Depreciação & Justo Valor
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBatchTags}
              title="Gerar Etiquetas de Tombamento em Lote"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap"
            >
              <QrCode className="w-3.5 h-3.5 text-neutral-600" />
              Etiquetas QR
            </button>

            <button
              onClick={onImportClick}
              title="Importar Ficheiro CSV de Inventário"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 text-neutral-600" />
              Importar
            </button>

            <button
              onClick={onExportCSV}
              title="Exportar Planilha Excel/CSV (27 Colunas)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-neutral-600" />
              Exportar
            </button>

            <button
              onClick={onNewAsset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Registar Activo
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="flex md:hidden items-center gap-4 py-2 border-t border-neutral-100 overflow-x-auto text-xs">
          <button
            onClick={() => onTabChange('inventory')}
            className={`whitespace-nowrap py-1 ${
              currentTab === 'inventory' ? 'font-semibold text-neutral-900 border-b border-neutral-900' : 'text-neutral-500'
            }`}
          >
            Planilha
          </button>
          <button
            onClick={() => onTabChange('cards')}
            className={`whitespace-nowrap py-1 ${
              currentTab === 'cards' ? 'font-semibold text-neutral-900 border-b border-neutral-900' : 'text-neutral-500'
            }`}
          >
            Galeria
          </button>
          <button
            onClick={() => onTabChange('audit')}
            className={`whitespace-nowrap py-1 ${
              currentTab === 'audit' ? 'font-semibold text-neutral-900 border-b border-neutral-900' : 'text-neutral-500'
            }`}
          >
            Auditoria
          </button>
          <button
            onClick={() => onTabChange('depreciation')}
            className={`whitespace-nowrap py-1 ${
              currentTab === 'depreciation' ? 'font-semibold text-neutral-900 border-b border-neutral-900' : 'text-neutral-500'
            }`}
          >
            Depreciação
          </button>
        </div>
      </div>
    </header>
  );
};

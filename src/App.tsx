/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Asset, AssetFilterState, AssetAuditStatus } from './types/asset';
import { INITIAL_ASSETS } from './data/initialAssets';
import { exportAssetsToCSV, parseCSVFile } from './utils/exportImport';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { AssetFilters } from './components/AssetFilters';
import { AssetTable } from './components/AssetTable';
import { AssetCardGrid } from './components/AssetCardGrid';
import { AssetDetailModal } from './components/AssetDetailModal';
import { AssetFormModal } from './components/AssetFormModal';
import { QrTagPrintModal } from './components/QrTagPrintModal';
import { AuditInventoryModal } from './components/AuditInventoryModal';
import { DepreciationView } from './components/DepreciationView';
import { CheckCircle2, AlertCircle, FileSpreadsheet, PlusCircle } from 'lucide-react';

const STORAGE_KEY = 'patrimoniopro_assets_v1';

export default function App() {
  // Load assets from localStorage or fallback to initial rich dataset
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved assets', e);
    }
    return INITIAL_ASSETS;
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    } catch (e) {
      console.error('Error saving assets to localStorage', e);
    }
  }, [assets]);

  // Tab state
  const [currentTab, setCurrentTab] = useState<'inventory' | 'cards' | 'audit' | 'depreciation'>('inventory');

  // Filters state
  const [filters, setFilters] = useState<AssetFilterState>({
    search: '',
    tipoActivo: '',
    estado: '',
    direccao: '',
    departamento: '',
    piso: '',
    accao: '',
    estado2: '',
  });

  // Modals state
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [tagsToPrint, setTagsToPrint] = useState<Asset[] | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter lists derived from data
  const availableFloors = Array.from(new Set(assets.map((a) => a.piso).filter(Boolean)));
  const availableDirectorates = Array.from(new Set(assets.map((a) => a.direccao).filter(Boolean)));

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const match =
        asset.descricao.toLowerCase().includes(q) ||
        asset.patrimonioId.toLowerCase().includes(q) ||
        asset.marca.toLowerCase().includes(q) ||
        asset.sala.toLowerCase().includes(q) ||
        asset.departamento.toLowerCase().includes(q) ||
        asset.direccao.toLowerCase().includes(q) ||
        asset.localizacao.toLowerCase().includes(q) ||
        (asset.especie && asset.especie.toLowerCase().includes(q)) ||
        (asset.numeroSerieOuChassi && asset.numeroSerieOuChassi.toLowerCase().includes(q));

      if (!match) return false;
    }

    if (filters.tipoActivo && asset.tipoActivo !== filters.tipoActivo) {
      return false;
    }

    if (filters.estado && asset.estado !== filters.estado) {
      return false;
    }

    if (filters.accao && asset.accao !== filters.accao) {
      return false;
    }

    if (filters.piso && asset.piso !== filters.piso) {
      return false;
    }

    if (filters.direccao && asset.direccao !== filters.direccao) {
      return false;
    }

    return true;
  });

  // Handlers for assets CRUD
  const handleSaveAsset = (assetData: Partial<Asset>) => {
    if (assetToEdit) {
      // Update existing
      setAssets((prev) =>
        prev.map((a) => (a.id === assetToEdit.id ? ({ ...a, ...assetData } as Asset) : a))
      );
      showToast('Registo patrimonial atualizado com sucesso.');
    } else {
      // Create new
      const newAsset: Asset = {
        id: `asset-${Date.now()}`,
        patrimonioId: assetData.patrimonioId || `PAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        carimboDataHora: assetData.carimboDataHora || new Date().toISOString().slice(0, 16).replace('T', ' '),
        tipoActivo: assetData.tipoActivo || 'Mobiliário e Escritório',
        piso: assetData.piso || 'Piso 0',
        direccao: assetData.direccao || 'Geral',
        departamento: assetData.departamento || 'Geral',
        sala: assetData.sala || 'Geral',
        descricao: assetData.descricao || 'Novo Activo',
        cor: assetData.cor || 'Padrão',
        tipo: assetData.tipo || 'Geral',
        marca: assetData.marca || 'Padrão',
        quantidade: Number(assetData.quantidade) || 1,
        estado: assetData.estado || 'Bom',
        accao: assetData.accao || 'Manter em Uso',
        qtdBomEstado: Number(assetData.qtdBomEstado) || 1,
        qtdMauEstado: Number(assetData.qtdMauEstado) || 0,
        valorAquisicao: Number(assetData.valorAquisicao) || 0,
        foto: assetData.foto || '',
        tipo2: assetData.tipo2 || '',
        especie: assetData.especie || '',
        finalidade: assetData.finalidade || 'Uso Operacional',
        classificacao: assetData.classificacao || 'Activo Imobilizado',
        localizacao: assetData.localizacao || 'Campus Principal',
        quantidade2: Number(assetData.quantidade2) || Number(assetData.quantidade) || 1,
        estado2: assetData.estado2 || 'Conferido e Conforme',
        valorUnitario: Number(assetData.valorUnitario) || 0,
        obs: assetData.obs || '',
        foto2: assetData.foto2 || '',
        numeroSerieOuChassi: assetData.numeroSerieOuChassi || '',
        responsavel: assetData.responsavel || '',
        vidaUtilAnos: assetData.vidaUtilAnos || 5,
      };

      setAssets((prev) => [newAsset, ...prev]);
      showToast('Novo bem patrimonial cadastrado com sucesso.');
    }

    setIsFormOpen(false);
    setAssetToEdit(null);
  };

  const handleDeleteAsset = (id: string) => {
    const toDelete = assets.find((a) => a.id === id);
    if (!toDelete) return;

    if (window.confirm(`Tem a certeza que deseja eliminar o bem patrimonial "${toDelete.descricao}"?`)) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      showToast('Registo patrimonial eliminado.', 'info');
      if (detailAsset?.id === id) {
        setDetailAsset(null);
      }
    }
  };

  const handleUpdateAssetAudit = (id: string, qtd2: number, estado2: AssetAuditStatus) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, quantidade2: qtd2, estado2 } : a))
    );
  };

  const handleExportCSV = () => {
    exportAssetsToCSV(filteredAssets);
    showToast(`Ficheiro CSV exportado com ${filteredAssets.length} registos (todas as 27 colunas).`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        try {
          const parsed = parseCSVFile(content);
          if (parsed.length > 0) {
            setAssets((prev) => [...parsed, ...prev]);
            showToast(`${parsed.length} activos importados da planilha com sucesso!`);
          } else {
            alert('Não foi possível identificar registos válidos no ficheiro CSV.');
          }
        } catch (err) {
          alert('Erro ao processar o arquivo CSV. Verifique a formatação.');
        }
      };
      reader.readAsText(file);
    }
    // reset input
    if (e.target) e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Hidden File Input for CSV Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".csv,text/csv"
        className="hidden"
      />

      {/* Strict 3-zone Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onNewAsset={() => {
          setAssetToEdit(null);
          setIsFormOpen(true);
        }}
        onExportCSV={handleExportCSV}
        onImportClick={() => fileInputRef.current?.click()}
        onBatchTags={() => setTagsToPrint(filteredAssets)}
        assetCount={assets.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg shadow-xl text-xs font-medium animate-bounce-subtle">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Metrics Dashboard */}
        <MetricsOverview assets={assets} />

        {/* Dynamic Tab Views */}
        {currentTab === 'inventory' && (
          <div>
            <AssetFilters
              search={filters.search}
              onSearchChange={(val) => setFilters((p) => ({ ...p, search: val }))}
              selectedCategory={filters.tipoActivo}
              onCategoryChange={(val) => setFilters((p) => ({ ...p, tipoActivo: val }))}
              selectedCondition={filters.estado}
              onConditionChange={(val) => setFilters((p) => ({ ...p, estado: val }))}
              selectedAction={filters.accao}
              onActionChange={(val) => setFilters((p) => ({ ...p, accao: val }))}
              selectedFloor={filters.piso}
              onFloorChange={(val) => setFilters((p) => ({ ...p, piso: val }))}
              selectedDirectorate={filters.direccao}
              onDirectorateChange={(val) => setFilters((p) => ({ ...p, direccao: val }))}
              onReset={() =>
                setFilters({
                  search: '',
                  tipoActivo: '',
                  estado: '',
                  direccao: '',
                  departamento: '',
                  piso: '',
                  accao: '',
                  estado2: '',
                })
              }
              totalFiltered={filteredAssets.length}
              totalAll={assets.length}
              availableFloors={availableFloors}
              availableDirectorates={availableDirectorates}
            />

            <AssetTable
              assets={filteredAssets}
              onViewAsset={setDetailAsset}
              onEditAsset={(a) => {
                setAssetToEdit(a);
                setIsFormOpen(true);
              }}
              onDeleteAsset={handleDeleteAsset}
              onPrintTag={(a) => setTagsToPrint([a])}
            />
          </div>
        )}

        {currentTab === 'cards' && (
          <div>
            <AssetFilters
              search={filters.search}
              onSearchChange={(val) => setFilters((p) => ({ ...p, search: val }))}
              selectedCategory={filters.tipoActivo}
              onCategoryChange={(val) => setFilters((p) => ({ ...p, tipoActivo: val }))}
              selectedCondition={filters.estado}
              onConditionChange={(val) => setFilters((p) => ({ ...p, estado: val }))}
              selectedAction={filters.accao}
              onActionChange={(val) => setFilters((p) => ({ ...p, accao: val }))}
              selectedFloor={filters.piso}
              onFloorChange={(val) => setFilters((p) => ({ ...p, piso: val }))}
              selectedDirectorate={filters.direccao}
              onDirectorateChange={(val) => setFilters((p) => ({ ...p, direccao: val }))}
              onReset={() =>
                setFilters({
                  search: '',
                  tipoActivo: '',
                  estado: '',
                  direccao: '',
                  departamento: '',
                  piso: '',
                  accao: '',
                  estado2: '',
                })
              }
              totalFiltered={filteredAssets.length}
              totalAll={assets.length}
              availableFloors={availableFloors}
              availableDirectorates={availableDirectorates}
            />

            <AssetCardGrid
              assets={filteredAssets}
              onViewAsset={setDetailAsset}
              onEditAsset={(a) => {
                setAssetToEdit(a);
                setIsFormOpen(true);
              }}
              onDeleteAsset={handleDeleteAsset}
              onPrintTag={(a) => setTagsToPrint([a])}
            />
          </div>
        )}

        {currentTab === 'audit' && (
          <AuditInventoryModal
            assets={assets}
            onUpdateAssetAudit={handleUpdateAssetAudit}
          />
        )}

        {currentTab === 'depreciation' && (
          <DepreciationView assets={assets} />
        )}
      </main>

      {/* Modals */}
      {detailAsset && (
        <AssetDetailModal
          asset={detailAsset}
          onClose={() => setDetailAsset(null)}
          onEdit={(a) => {
            setDetailAsset(null);
            setAssetToEdit(a);
            setIsFormOpen(true);
          }}
          onPrintTag={(a) => {
            setTagsToPrint([a]);
          }}
        />
      )}

      {isFormOpen && (
        <AssetFormModal
          assetToEdit={assetToEdit}
          onSave={handleSaveAsset}
          onClose={() => {
            setIsFormOpen(false);
            setAssetToEdit(null);
          }}
        />
      )}

      {tagsToPrint && (
        <QrTagPrintModal
          assets={tagsToPrint}
          onClose={() => setTagsToPrint(null)}
        />
      )}

      {/* Quiet Corporate Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-4 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PatrimônioPro · Sistema de Gestão e Inventário Patrimonial Integrado
          </div>
          <div className="font-mono text-[11px] text-neutral-400">
            Conformidade IFRS / PGC / IAS 16 & IAS 41
          </div>
        </div>
      </footer>
    </div>
  );
}

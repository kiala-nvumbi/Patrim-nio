import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { AssetCategory, AssetCondition, RecommendedAction } from '../types/asset';

interface AssetFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedCondition: string;
  onConditionChange: (val: string) => void;
  selectedAction: string;
  onActionChange: (val: string) => void;
  selectedFloor: string;
  onFloorChange: (val: string) => void;
  selectedDirectorate: string;
  onDirectorateChange: (val: string) => void;
  onReset: () => void;
  totalFiltered: number;
  totalAll: number;
  availableFloors: string[];
  availableDirectorates: string[];
}

const CATEGORIES: AssetCategory[] = [
  'Veículos e Frotas',
  'Equipamentos Hospitalares',
  'Mobiliário e Escritório',
  'Activos Biológicos',
  'Equipamentos de TI',
  'Instalações e Edifícios',
];

const CONDITIONS: AssetCondition[] = [
  'Novo',
  'Bom',
  'Razoável',
  'Mau',
  'Obsoleto',
  'Inoperante',
];

const ACTIONS: RecommendedAction[] = [
  'Manter em Uso',
  'Manutenção Preventiva',
  'Reparação Correctiva',
  'Abate / Alienação',
  'Transferência de Sector',
  'Calibração Biomédica',
  'Manejo Sanitário / Veterinário',
  'Leilão / Descarte',
];

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCondition,
  onConditionChange,
  selectedAction,
  onActionChange,
  selectedFloor,
  onFloorChange,
  selectedDirectorate,
  onDirectorateChange,
  onReset,
  totalFiltered,
  totalAll,
  availableFloors,
  availableDirectorates,
}) => {
  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategory !== '' ||
    selectedCondition !== '' ||
    selectedAction !== '' ||
    selectedFloor !== '' ||
    selectedDirectorate !== '';

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-3 sm:p-4 mb-4">
      {/* Top search and category pills/buttons */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar por descrição, marca, nº património, sala, chassi..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Counter & Clear */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-neutral-500">
          <span className="font-mono tabular-nums">
            Exibindo <strong className="text-neutral-900">{totalFiltered}</strong> de {totalAll} registos
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Category Segmented Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 mt-2 border-t border-neutral-100 no-scrollbar">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            selectedCategory === ''
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Todas as Categorias
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(selectedCategory === cat ? '' : cat)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Secondary dropdown filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-100 text-xs">
        {/* Estado */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
            Estado de Conservação
          </label>
          <select
            value={selectedCondition}
            onChange={(e) => onConditionChange(e.target.value)}
            className="w-full py-1.5 px-2 bg-neutral-50 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
          >
            <option value="">Todos os Estados</option>
            {CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        {/* Acção */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
            Acção Recomendada
          </label>
          <select
            value={selectedAction}
            onChange={(e) => onActionChange(e.target.value)}
            className="w-full py-1.5 px-2 bg-neutral-50 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
          >
            <option value="">Todas as Acções</option>
            {ACTIONS.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>

        {/* Piso */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
            Piso / Nível
          </label>
          <select
            value={selectedFloor}
            onChange={(e) => onFloorChange(e.target.value)}
            className="w-full py-1.5 px-2 bg-neutral-50 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
          >
            <option value="">Todos os Pisos</option>
            {availableFloors.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </div>

        {/* Direcção */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
            Direcção / Sector
          </label>
          <select
            value={selectedDirectorate}
            onChange={(e) => onDirectorateChange(e.target.value)}
            className="w-full py-1.5 px-2 bg-neutral-50 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none truncate"
          >
            <option value="">Todas as Direcções</option>
            {availableDirectorates.map((dir) => (
              <option key={dir} value={dir}>
                {dir}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

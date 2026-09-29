import React from 'react';
import { Asset } from '../types/asset';
import { formatCurrency } from '../utils/formatters';
import { Layers, ShieldCheck, AlertTriangle, Car, Stethoscope, Armchair, Sprout } from 'lucide-react';

interface MetricsOverviewProps {
  assets: Asset[];
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ assets }) => {
  const totalItems = assets.reduce((sum, a) => sum + (Number(a.quantidade) || 0), 0);
  const totalValue = assets.reduce((sum, a) => sum + (Number(a.valorAquisicao) || 0), 0);
  const totalGood = assets.reduce((sum, a) => sum + (Number(a.qtdBomEstado) || 0), 0);
  const totalBad = assets.reduce((sum, a) => sum + (Number(a.qtdMauEstado) || 0), 0);

  const goodPercentage = totalItems > 0 ? Math.round((totalGood / totalItems) * 100) : 0;

  const urgentActions = assets.filter(
    (a) =>
      a.accao === 'Reparação Correctiva' ||
      a.accao === 'Abate / Alienação' ||
      a.estado === 'Mau' ||
      a.estado === 'Inoperante'
  ).length;

  const vehiclesCount = assets
    .filter((a) => a.tipoActivo === 'Veículos e Frotas')
    .reduce((sum, a) => sum + a.quantidade, 0);

  const hospitalCount = assets
    .filter((a) => a.tipoActivo === 'Equipamentos Hospitalares')
    .reduce((sum, a) => sum + a.quantidade, 0);

  const furnitureCount = assets
    .filter((a) => a.tipoActivo === 'Mobiliário e Escritório')
    .reduce((sum, a) => sum + a.quantidade, 0);

  const biologicalCount = assets
    .filter((a) => a.tipoActivo === 'Activos Biológicos')
    .reduce((sum, a) => sum + a.quantidade, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Metric 1 */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4 transition-colors">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-medium text-neutral-500">Património Total</span>
          <Layers className="w-4 h-4 text-neutral-400" />
        </div>
        <div className="text-2xl font-semibold tracking-tight text-neutral-900 font-mono tabular-nums">
          {totalItems.toLocaleString('pt-PT')}
          <span className="text-xs font-normal text-neutral-500 font-sans ml-1.5">itens</span>
        </div>
        <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
          <span>{assets.length} registos cadastrais</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4 transition-colors">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-medium text-neutral-500">Valor Contabilístico</span>
          <span className="text-xs font-mono text-neutral-400">AOA / Kz</span>
        </div>
        <div className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 font-mono tabular-nums truncate">
          {formatCurrency(totalValue)}
        </div>
        <div className="mt-2 text-xs text-neutral-500">
          Custo de aquisição imobilizado
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4 transition-colors">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-medium text-neutral-500">Índice de Bom Estado</span>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-semibold tracking-tight text-neutral-900 font-mono tabular-nums">
          {goodPercentage}%
          <span className="text-xs font-normal text-neutral-500 font-sans ml-1.5">
            ({totalGood} conformes)
          </span>
        </div>
        <div className="mt-2 text-xs text-neutral-500">
          {totalBad} unidades em mau estado
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4 transition-colors">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-medium text-neutral-500">Atenção & Abates</span>
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-semibold tracking-tight text-amber-700 font-mono tabular-nums">
          {urgentActions}
          <span className="text-xs font-normal text-neutral-500 font-sans ml-1.5">alertas</span>
        </div>
        <div className="mt-2 text-xs text-neutral-500">
          Reparações ou abates pendentes
        </div>
      </div>

      {/* Category breakdown bar */}
      <div className="col-span-2 lg:col-span-4 bg-white border border-neutral-200 rounded-lg px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-neutral-500 font-medium">Bens por Categoria Chave:</span>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-neutral-700">
            <div className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-600" />
              <span>Veículos:</span>
              <strong className="font-mono tabular-nums text-neutral-900">{vehiclesCount}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Hospitalar:</span>
              <strong className="font-mono tabular-nums text-neutral-900">{hospitalCount}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              <Armchair className="w-3.5 h-3.5 text-amber-600" />
              <span>Mobiliário:</span>
              <strong className="font-mono tabular-nums text-neutral-900">{furnitureCount}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Biológicos:</span>
              <strong className="font-mono tabular-nums text-neutral-900">{biologicalCount}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

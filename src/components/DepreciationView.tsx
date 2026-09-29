import React from 'react';
import { Asset } from '../types/asset';
import { formatCurrency } from '../utils/formatters';
import { TrendingDown, ShieldAlert, Sparkles, Sprout, Car, Stethoscope } from 'lucide-react';

interface DepreciationViewProps {
  assets: Asset[];
}

export const DepreciationView: React.FC<DepreciationViewProps> = ({ assets }) => {
  // Calculate depreciation and fair value
  const calculations = assets.map((asset) => {
    const acquisition = Number(asset.valorAquisicao) || 0;
    const currentYear = 2026;
    const acquisitionYear = asset.anoFabrico || 2023;
    const yearsInUse = Math.max(0, currentYear - acquisitionYear);
    const lifeYears = asset.vidaUtilAnos || 5;

    let depreciationRate = 0.20; // default 20%
    let isBiological = asset.tipoActivo === 'Activos Biológicos';

    if (asset.tipoActivo === 'Veículos e Frotas') {
      depreciationRate = 0.20; // 5 anos
    } else if (asset.tipoActivo === 'Equipamentos Hospitalares') {
      depreciationRate = 0.125; // 8 anos
    } else if (asset.tipoActivo === 'Mobiliário e Escritório') {
      depreciationRate = 0.10; // 10 anos
    }

    let currentBookValue = 0;
    let accumulatedDepreciation = 0;

    if (isBiological) {
      // IAS 41: Biological assets are valued at Fair Value less costs to sell
      // Healthy young livestock/timber often appreciates in early years then stabilizes
      const biologicalGrowthFactor = asset.estado === 'Bom' || asset.estado === 'Novo' ? 1.15 : 0.90;
      currentBookValue = acquisition * biologicalGrowthFactor;
      accumulatedDepreciation = acquisition - currentBookValue; // Negative if appreciated
    } else {
      // Straight-line depreciation
      const totalDepreciable = Math.min(1, (yearsInUse / lifeYears));
      accumulatedDepreciation = acquisition * totalDepreciable;
      currentBookValue = Math.max(acquisition * 0.05, acquisition - accumulatedDepreciation); // 5% residual value
    }

    return {
      asset,
      acquisition,
      yearsInUse,
      lifeYears,
      isBiological,
      accumulatedDepreciation,
      currentBookValue,
    };
  });

  const totalAcquisition = calculations.reduce((sum, c) => sum + c.acquisition, 0);
  const totalCurrentValue = calculations.reduce((sum, c) => sum + c.currentBookValue, 0);
  const totalAccumulatedDepreciation = totalAcquisition - totalCurrentValue;

  return (
    <div className="space-y-6">
      {/* Top Banner & Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <span className="text-xs font-medium text-neutral-500 block mb-1">
            Valor Histórico de Aquisição
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {formatCurrency(totalAcquisition)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Custo total de entrada no balanço
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <span className="text-xs font-medium text-neutral-500 block mb-1">
            Depreciação Acumulada
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-rose-700">
            - {formatCurrency(Math.max(0, totalAccumulatedDepreciation))}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Desgaste / Amortização pelo tempo de uso
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4 bg-gradient-to-br from-white to-emerald-50/30">
          <span className="text-xs font-medium text-emerald-800 block mb-1">
            Valor Contabilístico Líquido Atual
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {formatCurrency(totalCurrentValue)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Imobilizado Líquido + Justo Valor IAS 41
          </div>
        </div>
      </div>

      {/* Accounting Standards explanation note */}
      <div className="p-4 bg-neutral-100/70 border border-neutral-200 rounded-lg flex items-start gap-3 text-xs text-neutral-700">
        <Sparkles className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-neutral-900 block font-semibold mb-0.5">
            Tratamento Contabilístico por Categoria Patrimonial (PGC / IFRS):
          </strong>
          <span className="leading-relaxed">
            • <strong>Veículos & Frotas / Mobiliário / Hospitalar:</strong> Método das quotas constantes com base na vida útil regulamentar.
            <br />
            • <strong>Activos Biológicos (Semoventes e Culturas Perenes):</strong> Norma IAS 41 / PGC — Mensurados ao <em>Justo Valor</em> deduzido das despesas no ponto de venda, com reavaliação periódica do ganho biológico.
          </span>
        </div>
      </div>

      {/* Depreciation Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-100 text-neutral-700 font-semibold uppercase text-[11px] border-b border-neutral-200">
            <tr>
              <th className="py-3 px-3">Código / Bem</th>
              <th className="py-3 px-3">Categoria</th>
              <th className="py-3 px-3 text-right">Valor Aquisição</th>
              <th className="py-3 px-3 text-center">Tempo em Uso</th>
              <th className="py-3 px-3 text-center">Vida Útil</th>
              <th className="py-3 px-3 text-right">Depreciação Acumulada</th>
              <th className="py-3 px-3 text-right">Valor Líquido Atual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {calculations.map(({ asset, acquisition, yearsInUse, lifeYears, isBiological, accumulatedDepreciation, currentBookValue }) => (
              <tr key={asset.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-2.5 px-3">
                  <span className="font-mono font-bold text-neutral-900 block text-xs">
                    {asset.patrimonioId}
                  </span>
                  <span className="font-medium text-neutral-800 line-clamp-1">
                    {asset.descricao}
                  </span>
                </td>

                <td className="py-2.5 px-3 text-neutral-600">
                  <div className="font-medium text-neutral-800">{asset.tipoActivo}</div>
                  <div className="text-[10px] text-neutral-400">{asset.classificacao}</div>
                </td>

                <td className="py-2.5 px-3 text-right font-mono tabular-nums text-neutral-900 font-medium">
                  {formatCurrency(acquisition)}
                </td>

                <td className="py-2.5 px-3 text-center font-mono tabular-nums text-neutral-600">
                  {yearsInUse} anos
                </td>

                <td className="py-2.5 px-3 text-center font-mono tabular-nums text-neutral-600">
                  {lifeYears} anos
                </td>

                <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                  {isBiological ? (
                    <span className="text-emerald-700 font-medium">+ Ganho Biológico</span>
                  ) : (
                    <span className="text-rose-700 font-medium">
                      - {formatCurrency(accumulatedDepreciation)}
                    </span>
                  )}
                </td>

                <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-950 tabular-nums">
                  {formatCurrency(currentBookValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

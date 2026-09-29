import React from 'react';
import { Asset } from '../types/asset';
import { formatCurrency, getConditionBadge, getActionBadge } from '../utils/formatters';
import { Eye, Edit3, QrCode, Trash2, MapPin, Building, Tag } from 'lucide-react';

interface AssetCardGridProps {
  assets: Asset[];
  onViewAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  onPrintTag: (asset: Asset) => void;
}

export const AssetCardGrid: React.FC<AssetCardGridProps> = ({
  assets,
  onViewAsset,
  onEditAsset,
  onDeleteAsset,
  onPrintTag,
}) => {
  if (assets.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center text-neutral-500">
        <p className="text-base font-semibold text-neutral-800">Nenhum activo encontrado</p>
        <p className="text-xs text-neutral-500 mt-1">
          Ajuste os filtros de busca para visualizar os itens cadastrados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map((asset) => {
        const conditionStyle = getConditionBadge(asset.estado);
        const actionStyle = getActionBadge(asset.accao);

        return (
          <div
            key={asset.id}
            className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-neutral-400 transition-colors shadow-xs"
          >
            <div>
              {/* Photo Viewport */}
              <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden border-b border-neutral-200">
                {asset.foto ? (
                  <img
                    src={asset.foto}
                    alt={asset.descricao}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400">
                    <Tag className="w-8 h-8 mb-1 opacity-60" />
                    <span className="text-xs font-mono">Sem Fotografia</span>
                  </div>
                )}

                {/* Quiet single condition tag on bottom edge of image */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] rounded">
                  <span className={`w-1.5 h-1.5 rounded-full ${conditionStyle.dot}`}></span>
                  <span>{asset.estado}</span>
                  <span className="text-neutral-400">·</span>
                  <span className="font-mono">{asset.quantidade} un.</span>
                </div>

                <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur-xs text-neutral-900 text-[11px] font-mono font-medium rounded shadow-xs">
                  {asset.patrimonioId}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Quiet unboxed metadata: category and brand */}
                <div className="text-xs text-neutral-500 flex items-center gap-2 mb-1.5">
                  <span className="font-medium text-neutral-700 truncate">{asset.tipoActivo}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{asset.marca}</span>
                </div>

                {/* Primary Title */}
                <h3
                  onClick={() => onViewAsset(asset)}
                  className="text-sm font-semibold text-neutral-900 line-clamp-2 hover:underline cursor-pointer"
                  title={asset.descricao}
                >
                  {asset.descricao}
                </h3>

                {/* Location details */}
                <div className="mt-2.5 space-y-1 text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{asset.localizacao}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-500 truncate">
                    <Building className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{asset.sala} ({asset.piso})</span>
                  </div>
                </div>

                {/* Recommended action unboxed */}
                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Recomendação:</span>
                  <span className={`font-medium text-[11px] ${actionStyle.text}`}>
                    {asset.accao}
                  </span>
                </div>

                {/* Value display with tabular nums */}
                <div className="mt-2 flex items-baseline justify-between text-xs">
                  <span className="text-neutral-500">Valor Aquisição:</span>
                  <span className="font-semibold text-neutral-900 font-mono tabular-nums text-sm">
                    {formatCurrency(asset.valorAquisicao)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => onViewAsset(asset)}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-950 inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Detalhes
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPrintTag(asset)}
                  title="Etiqueta QR"
                  className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 rounded transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onEditAsset(asset)}
                  title="Editar"
                  className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 rounded transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteAsset(asset.id)}
                  title="Eliminar"
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

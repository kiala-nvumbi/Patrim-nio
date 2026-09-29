import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { formatCurrency, getConditionBadge, getActionBadge, getAuditStatusBadge } from '../utils/formatters';
import { Eye, Edit3, Trash2, QrCode, ArrowUpDown, Image as ImageIcon, Sliders } from 'lucide-react';

interface AssetTableProps {
  assets: Asset[];
  onViewAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  onPrintTag: (asset: Asset) => void;
}

type SortField = 'descricao' | 'tipoActivo' | 'quantidade' | 'valorAquisicao' | 'estado' | 'carimboDataHora';

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  onViewAsset,
  onEditAsset,
  onDeleteAsset,
  onPrintTag,
}) => {
  const [viewMode, setViewMode] = useState<'standard' | 'spreadsheet'>('standard');
  const [sortField, setSortField] = useState<SortField>('carimboDataHora');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-xs overflow-hidden">
      {/* Table header bar controls */}
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-800">
            Registo Inventariado ({sortedAssets.length})
          </span>
          <span className="text-neutral-300">|</span>
          <span className="text-xs text-neutral-500">
            Tabela de Dados Patrimoniais
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-200/80 p-0.5 rounded-md text-xs">
            <button
              onClick={() => setViewMode('standard')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'standard'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Visão Operacional
            </button>
            <button
              onClick={() => setViewMode('spreadsheet')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'spreadsheet'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Planilha Completa (27 Colunas)
            </button>
          </div>
        </div>
      </div>

      {/* Main Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-700">
          {/* Table Headers */}
          <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200 font-semibold uppercase tracking-wider text-[11px]">
            {viewMode === 'standard' ? (
              <tr>
                <th className="py-3 px-3 w-12 text-center">Foto</th>
                <th
                  onClick={() => handleSort('carimboDataHora')}
                  className="py-3 px-3 cursor-pointer hover:bg-neutral-200/60 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>ID / Data</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('descricao')}
                  className="py-3 px-3 cursor-pointer hover:bg-neutral-200/60 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Descrição do Activo & Marca</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('tipoActivo')}
                  className="py-3 px-3 cursor-pointer hover:bg-neutral-200/60 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Categoria</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Localização / Piso</th>
                <th
                  onClick={() => handleSort('quantidade')}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-neutral-200/60 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Qtd</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('estado')}
                  className="py-3 px-3 cursor-pointer hover:bg-neutral-200/60 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Estado</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Acção</th>
                <th
                  onClick={() => handleSort('valorAquisicao')}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-neutral-200/60 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Valor Total (Kz)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center w-28">Operações</th>
              </tr>
            ) : (
              // Spreadsheet headers matching exact user image yellow style or enterprise yellow ribbon
              <tr className="bg-amber-100 text-amber-950 font-bold border-b border-amber-300">
                <th className="py-2.5 px-3 whitespace-nowrap">Ações</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Carimbo de data/hora</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Tipo de Activo</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Piso</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Direcção</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Departamento</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Sala</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[200px]">Descrição</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Cor</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Tipo</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Marca</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Quantidade</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Estado</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Acção</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Qtd Bom Estado</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Qtd Mau Estado</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Valor de Aquisição</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Foto</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Tipo 2</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Espécie</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Finalidade</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Classificação</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Localização</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Quantidade 2</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Estado 2</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Valor Unitário</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[240px]">OBS</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Foto 2</th>
              </tr>
            )}
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-neutral-200 bg-white">
            {sortedAssets.length === 0 ? (
              <tr>
                <td
                  colSpan={viewMode === 'standard' ? 10 : 28}
                  className="py-12 text-center text-neutral-500"
                >
                  <p className="text-sm font-medium">Nenhum activo encontrado</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Tente ajustar os filtros ou a pesquisa para encontrar os registos desejados.
                  </p>
                </td>
              </tr>
            ) : (
              sortedAssets.map((asset) => {
                const conditionStyle = getConditionBadge(asset.estado);
                const actionStyle = getActionBadge(asset.accao);
                const auditStyle = getAuditStatusBadge(asset.estado2);

                if (viewMode === 'standard') {
                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-neutral-50/80 transition-colors group"
                    >
                      {/* Photo Thumbnail */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => onViewAsset(asset)}
                          className="w-9 h-9 rounded bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center relative hover:opacity-85 transition-opacity"
                        >
                          {asset.foto ? (
                            <img
                              src={asset.foto}
                              alt={asset.descricao}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-neutral-400" />
                          )}
                        </button>
                      </td>

                      {/* ID / Timestamp */}
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-medium text-neutral-900 text-xs">
                          {asset.patrimonioId}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono tabular-nums">
                          {asset.carimboDataHora}
                        </div>
                      </td>

                      {/* Description & Brand */}
                      <td className="py-2.5 px-3">
                        <div
                          onClick={() => onViewAsset(asset)}
                          className="font-medium text-neutral-900 cursor-pointer hover:underline line-clamp-1"
                        >
                          {asset.descricao}
                        </div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                          <span>{asset.marca}</span>
                          {asset.cor && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Cor: {asset.cor}</span>
                            </>
                          )}
                          {asset.especie && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="italic">{asset.especie}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3">
                        <span className="text-xs text-neutral-700 block">
                          {asset.tipoActivo}
                        </span>
                        <span className="text-[11px] text-neutral-400 block truncate max-w-[140px]">
                          {asset.tipo}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-2.5 px-3">
                        <span className="text-xs text-neutral-700 block font-medium">
                          {asset.sala}
                        </span>
                        <span className="text-[11px] text-neutral-400 block truncate max-w-[140px]">
                          {asset.piso} · {asset.departamento}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="font-mono tabular-nums text-xs font-semibold text-neutral-900">
                          {asset.quantidade}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {asset.qtdBomEstado} bom / {asset.qtdMauEstado} mau
                        </div>
                      </td>

                      {/* Condition */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${conditionStyle.bg} ${conditionStyle.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${conditionStyle.dot}`}></span>
                          {asset.estado}
                        </span>
                      </td>

                      {/* Recommended Action */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${actionStyle.bg}`}>
                          {asset.accao}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="font-mono tabular-nums text-xs font-semibold text-neutral-900">
                          {formatCurrency(asset.valorAquisicao)}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono tabular-nums">
                          unit. {formatCurrency(asset.valorUnitario)}
                        </div>
                      </td>

                      {/* Operations */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewAsset(asset)}
                            title="Visualizar Detalhes"
                            className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onPrintTag(asset)}
                            title="Imprimir Etiqueta Tombamento QR"
                            className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditAsset(asset)}
                            title="Editar Registo"
                            className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteAsset(asset.id)}
                            title="Eliminar Activo"
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // SPREADSHEET ROW (exact 27 columns as in user's image)
                return (
                  <tr
                    key={asset.id}
                    className="hover:bg-amber-50/40 transition-colors font-mono text-[11px]"
                  >
                    {/* Actions button */}
                    <td className="py-2 px-3 whitespace-nowrap bg-neutral-50 border-r border-neutral-200">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onViewAsset(asset)}
                          className="px-1.5 py-0.5 bg-neutral-100 text-neutral-800 rounded hover:bg-neutral-200 text-[10px]"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => onEditAsset(asset)}
                          className="px-1.5 py-0.5 bg-neutral-100 text-neutral-800 rounded hover:bg-neutral-200 text-[10px]"
                        >
                          Editar
                        </button>
                      </div>
                    </td>

                    {/* 1. Carimbo de data/hora */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-600">
                      {asset.carimboDataHora}
                    </td>

                    {/* 2. Tipo de Activo */}
                    <td className="py-2 px-3 whitespace-nowrap font-medium text-neutral-900">
                      {asset.tipoActivo}
                    </td>

                    {/* 3. Piso */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-700">
                      {asset.piso}
                    </td>

                    {/* 4. Direcção */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-700">
                      {asset.direccao}
                    </td>

                    {/* 5. Departamento */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-700">
                      {asset.departamento}
                    </td>

                    {/* 6. Sala */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-800 font-medium">
                      {asset.sala}
                    </td>

                    {/* 7. Descrição */}
                    <td className="py-2 px-3 font-sans font-medium text-neutral-900 whitespace-nowrap">
                      {asset.descricao}
                    </td>

                    {/* 8. Cor */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-600">
                      {asset.cor}
                    </td>

                    {/* 9. Tipo */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-700">
                      {asset.tipo}
                    </td>

                    {/* 10. Marca */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-800 font-medium">
                      {asset.marca}
                    </td>

                    {/* 11. Quantidade */}
                    <td className="py-2 px-3 text-right font-semibold text-neutral-900 tabular-nums">
                      {asset.quantidade}
                    </td>

                    {/* 12. Estado */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded ${conditionStyle.bg} ${conditionStyle.text}`}>
                        {asset.estado}
                      </span>
                    </td>

                    {/* 13. Acção */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded ${actionStyle.bg}`}>
                        {asset.accao}
                      </span>
                    </td>

                    {/* 14. Qtd Bom Estado */}
                    <td className="py-2 px-3 text-right text-emerald-700 tabular-nums">
                      {asset.qtdBomEstado}
                    </td>

                    {/* 15. Qtd Mau Estado */}
                    <td className="py-2 px-3 text-right text-rose-700 tabular-nums">
                      {asset.qtdMauEstado}
                    </td>

                    {/* 16. Valor de Aquisição */}
                    <td className="py-2 px-3 text-right font-semibold tabular-nums text-neutral-900">
                      {formatCurrency(asset.valorAquisicao)}
                    </td>

                    {/* 17. Foto */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      {asset.foto ? (
                        <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => onViewAsset(asset)}>
                          [Foto 1 Anexada]
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>

                    {/* 18. Tipo 2 */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-600">
                      {asset.tipo2}
                    </td>

                    {/* 19. Espécie */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-700 italic">
                      {asset.especie}
                    </td>

                    {/* 20. Finalidade */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-700">
                      {asset.finalidade}
                    </td>

                    {/* 21. Classificação */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-700">
                      {asset.classificacao}
                    </td>

                    {/* 22. Localização */}
                    <td className="py-2 px-3 whitespace-nowrap text-neutral-700">
                      {asset.localizacao}
                    </td>

                    {/* 23. Quantidade 2 */}
                    <td className="py-2 px-3 text-right tabular-nums text-neutral-900">
                      {asset.quantidade2}
                    </td>

                    {/* 24. Estado 2 */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${auditStyle.bg} ${auditStyle.text}`}>
                        {asset.estado2}
                      </span>
                    </td>

                    {/* 25. Valor Unitário */}
                    <td className="py-2 px-3 text-right tabular-nums text-neutral-800">
                      {formatCurrency(asset.valorUnitario)}
                    </td>

                    {/* 26. OBS */}
                    <td className="py-2 px-3 font-sans text-neutral-600 max-w-xs truncate" title={asset.obs}>
                      {asset.obs || '-'}
                    </td>

                    {/* 27. Foto 2 */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      {asset.foto2 ? (
                        <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => onViewAsset(asset)}>
                          [Foto 2 Anexada]
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
